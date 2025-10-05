import {
    Button,
    Col,
    Input,
    Modal,
    Popconfirm,
    Row,
    Space,
    Table,
    Typography,
} from "antd";
import { useEffect, useState } from "react";
import {
    addCompetency,
    addCriteria,
    deleteCompetency,
    deleteCriteria,
    getCriteriaList,
    updateCompetency,
    updateCriteria,
} from "../api/competencyAPI"; // API lấy dữ liệu

const { Title } = Typography;

const CompetencyManagement = () => {
    const [criteria, setCriteria] = useState([]); // toàn bộ criteria từ API
    const [competencies, setCompetencies] = useState([]); // danh sách loại đánh giá
    const [selectedId, setSelectedId] = useState(null);

    // Modal thêm competency
    const [isCompModalOpen, setIsCompModalOpen] = useState(false);
    const [newComp, setNewComp] = useState("");

    // Modal thêm tiêu chí
    const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false);
    const [newCriteria, setNewCriteria] = useState("");

    // Modal sửa competency
    const [isEditCompModalOpen, setIsEditCompModalOpen] = useState(false);
    const [editComp, setEditComp] = useState(null);

    // Modal sửa criteria
    const [isEditCriteriaModalOpen, setIsEditCriteriaModalOpen] = useState(false);
    const [editCriteria, setEditCriteria] = useState(null);

    // 🔹 Gọi API khi load trang
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getCriteriaList(); // [{id, name, competency:{id, name}}]
                setCriteria(res);

                // nhóm competency từ criteria
                const compMap = {};
                res.forEach((c) => {
                    compMap[c.competency.id] = c.competency.name;
                });

                const comps = Object.entries(compMap).map(([id, name]) => ({
                    id: parseInt(id),
                    name,
                }));
                setCompetencies(comps);
            } catch (err) {
                console.error("Lỗi khi fetch criteria:", err);
            }
        };
        fetchData();
    }, []);

    // Xóa competency
    const handleDeleteComp = async (id) => {
        try {
            await deleteCompetency(id);
            setCompetencies(competencies.filter((c) => c.id !== id));
            setCriteria(criteria.filter((c) => c.competency.id !== id));
            if (selectedId === id) setSelectedId(null);
        } catch (err) {
            console.error("Lỗi khi xóa competency:", err);
        }
    };

    // Xóa criteria
    const handleDeleteCriteria = async (id) => {
        try {
            await deleteCriteria(id);
            setCriteria(criteria.filter((c) => c.id !== id));
        } catch (err) {
            console.error("Lỗi khi xóa criteria:", err);
        }
    };

    // Thêm competency
    const handleAddComp = async () => {
        if (!newComp.trim()) return;
        try {
            const res = await addCompetency({ name: newComp });
            setCompetencies([...competencies, res]);
            setNewComp("");
            setIsCompModalOpen(false);
        } catch (err) {
            console.error("Lỗi khi thêm competency:", err);
        }
    };

    // Thêm criteria
    const handleAddCriteria = async () => {
        if (!newCriteria.trim() || !selectedId) return;
        try {
            const res = await addCriteria({
                name: newCriteria,
                competency: { id: selectedId },
            });
            setCriteria([...criteria, res]);
            setNewCriteria("");
            setIsCriteriaModalOpen(false);
        } catch (err) {
            console.error("Lỗi khi thêm criteria:", err);
        }
    };

    // Cập nhật competency
    const handleEditComp = async () => {
        if (!editComp?.name.trim()) return;
        try {
            const res = await updateCompetency(editComp.id, { name: editComp.name });
            setCompetencies(
                competencies.map((c) => (c.id === editComp.id ? res : c))
            );
            setIsEditCompModalOpen(false);
            setEditComp(null);
        } catch (err) {
            console.error("Lỗi khi cập nhật competency:", err);
        }
    };

    // Cập nhật criteria
    const handleEditCriteria = async () => {
        if (!editCriteria?.name.trim()) return;
        try {
            const res = await updateCriteria(editCriteria.id, {
                name: editCriteria.name,
                competency: { id: selectedId },
            });
            setCriteria(
                criteria.map((c) => (c.id === editCriteria.id ? res : c))
            );
            setIsEditCriteriaModalOpen(false);
            setEditCriteria(null);
        } catch (err) {
            console.error("Lỗi khi cập nhật criteria:", err);
        }
    };

    return (
        <Row gutter={16}>
            {/* Bên trái: Competency */}
            <Col span={10}>
                <div style={{ background: "#fff", padding: 20, borderRadius: 8 }}>
                    <Space style={{ justifyContent: "space-between", width: "100%" }}>
                        <Title level={4}>Danh sách loại đánh giá</Title>
                        <Button type="primary" onClick={() => setIsCompModalOpen(true)}>
                            + Thêm loại đánh giá
                        </Button>
                    </Space>

                    <Table
                        rowKey="id"
                        dataSource={competencies.map((c, index) => ({
                            ...c,
                            stt: index + 1,
                        }))}
                        pagination={false}
                        columns={[
                            { title: "STT", dataIndex: "stt", key: "stt", width: 60 },
                            { title: "Loại đánh giá", dataIndex: "name", key: "name" },
                            {
                                title: "Hành động",
                                key: "actions",
                                render: (_, record) => (
                                    <Space>
                                        <Button
                                            size="small"
                                            onClick={() => setSelectedId(record.id)}
                                        >
                                            Xem tiêu chí
                                        </Button>
                                        <Button
                                            size="small"
                                            onClick={() => {
                                                setEditComp(record);
                                                setIsEditCompModalOpen(true);
                                            }}
                                        >
                                            Sửa
                                        </Button>
                                        <Popconfirm
                                            title="Bạn có chắc chắn muốn xóa loại đánh giá này?"
                                            onConfirm={() => handleDeleteComp(record.id)}
                                        >
                                            <Button danger size="small">Xóa</Button>
                                        </Popconfirm>
                                    </Space>
                                ),
                            },
                        ]}
                    />
                </div>
            </Col>

            {/* Bên phải: Criteria */}
            <Col span={14}>
                <div style={{ background: "#fff", padding: 20, borderRadius: 8 }}>
                    {selectedId ? (
                        <>
                            <Space style={{ justifyContent: "space-between", width: "100%" }}>
                                <Title level={4}>
                                    Tiêu chí của: {competencies.find((c) => c.id === selectedId)?.name}
                                </Title>
                                <Button type="primary" onClick={() => setIsCriteriaModalOpen(true)}>
                                    + Thêm Tiêu chí
                                </Button>
                            </Space>

                            <Table
                                rowKey="id"
                                dataSource={criteria
                                    .filter((c) => c.competency.id === selectedId)
                                    .map((c, index) => ({
                                        ...c,
                                        stt: index + 1,
                                    }))}
                                pagination={false}
                                columns={[
                                    { title: "STT", dataIndex: "stt", key: "stt", width: 60 },
                                    { title: "Tên Tiêu chí", dataIndex: "name", key: "name" },
                                    {
                                        title: "Hành động",
                                        key: "actions",
                                        render: (_, record) => (
                                            <Space>
                                                <Button
                                                    size="small"
                                                    onClick={() => {
                                                        setEditCriteria(record);
                                                        setIsEditCriteriaModalOpen(true);
                                                    }}
                                                >
                                                    Sửa
                                                </Button>
                                                <Popconfirm
                                                    title="Bạn có chắc chắn muốn xóa tiêu chí này?"
                                                    onConfirm={() => handleDeleteCriteria(record.id)}
                                                >
                                                    <Button danger size="small">Xóa</Button>
                                                </Popconfirm>
                                            </Space>
                                        ),
                                    },
                                ]}
                            />
                        </>
                    ) : (
                        <Title level={5} style={{ color: "#888" }}>
                            Chọn "Xem tiêu chí" để quản lý
                        </Title>
                    )}
                </div>
            </Col>

            {/* Modal thêm Competency */}
            <Modal
                title="Thêm loại đánh giá"
                open={isCompModalOpen}
                onOk={handleAddComp}
                onCancel={() => setIsCompModalOpen(false)}
            >
                <Input
                    placeholder="Nhập tên loại đánh giá"
                    value={newComp}
                    onChange={(e) => setNewComp(e.target.value)}
                />
            </Modal>

            {/* Modal thêm Criteria */}
            <Modal
                title="Thêm Tiêu chí"
                open={isCriteriaModalOpen}
                onOk={handleAddCriteria}
                onCancel={() => setIsCriteriaModalOpen(false)}
            >
                <Input
                    placeholder="Nhập tên Tiêu chí"
                    value={newCriteria}
                    onChange={(e) => setNewCriteria(e.target.value)}
                />
            </Modal>

            {/* Modal sửa Competency */}
            <Modal
                title="Chỉnh sửa loại đánh giá"
                open={isEditCompModalOpen}
                onOk={handleEditComp}
                onCancel={() => setIsEditCompModalOpen(false)}
            >
                <Input
                    placeholder="Nhập tên loại đánh giá"
                    value={editComp?.name || ""}
                    onChange={(e) =>
                        setEditComp((prev) => ({ ...prev, name: e.target.value }))
                    }
                />
            </Modal>

            {/* Modal sửa Criteria */}
            <Modal
                title="Chỉnh sửa Tiêu chí"
                open={isEditCriteriaModalOpen}
                onOk={handleEditCriteria}
                onCancel={() => setIsEditCriteriaModalOpen(false)}
            >
                <Input
                    placeholder="Nhập tên Tiêu chí"
                    value={editCriteria?.name || ""}
                    onChange={(e) =>
                        setEditCriteria((prev) => ({ ...prev, name: e.target.value }))
                    }
                />
            </Modal>
        </Row>
    );
};

export default CompetencyManagement;
