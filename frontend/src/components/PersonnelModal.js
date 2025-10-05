import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import {
    Button,
    Form,
    Input,
    Modal,
    Popconfirm,
    Select,
    Switch,
    Upload,
    message
} from "antd";
import { useEffect, useState } from "react";
import { getDepartmentList } from "../api/departmentAPI";
import { createPersonnel, updatePersonnel } from "../api/personnelAPI";
import { getRoleList } from "../api/roleAPI";

const { Option } = Select;

const PersonnelModal = ({ open, onOk, onCancel, onDelete, editingUser, form }) => {
    const [departments, setDepartments] = useState([]);
    const [roles, setRoles] = useState([]);

    // load departments
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const data = await getDepartmentList();
                setDepartments(data);
            } catch (err) {
                console.error("Lỗi khi load departments:", err);
            }
        };
        fetchDepartments();
    }, []);

    // load roles
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const data = await getRoleList();
                setRoles(data);
            } catch (err) {
                console.error("Lỗi khi load roles:", err);
            }
        };
        fetchRoles();
    }, []);

    // khi mở modal -> fill dữ liệu user
    useEffect(() => {
        if (editingUser) {
            form.setFieldsValue({
                ...editingUser,
                department: editingUser.department?.id,
                role: editingUser.role?.id,
                avatar: editingUser.avatar
                    ? [
                        {
                            uid: "-1",
                            name: "avatar.png",
                            status: "done",
                            url: `http://localhost:8080/images/avatar/${editingUser.avatar}`,
                        },
                    ]
                    : [],
            });
        } else {
            form.resetFields();
        }
    }, [editingUser, form]);

    // handle save
    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();

            if (values.avatar?.[0]?.originFileObj) {
                formData.append("avatar", values.avatar[0].originFileObj);
            }

            formData.append("name", values.name);
            formData.append("email", values.email);
            formData.append("phone", values.phone);
            formData.append("department", values.department);
            formData.append("role", values.role);
            formData.append("isActive", values.isActive ? "true" : "false");

            let updatedUser;
            if (editingUser) {
                updatedUser = await updatePersonnel(editingUser.id, formData);
                message.success("Cập nhật nhân sự thành công!");
            } else {
                updatedUser = await createPersonnel(formData);
                message.success("Thêm nhân sự thành công!");
            }

            onOk(updatedUser);
        } catch (err) {
            alert(err);
            console.error("Lỗi khi lưu nhân sự:", err);
        }
    };

    return (
        <Modal
            title={editingUser ? "Sửa nhân sự" : "Thêm nhân sự"}
            open={open}
            onCancel={onCancel}
            okText="Lưu"
            cancelText="Huỷ"
            onOk={handleSave}
            footer={[
                editingUser && (
                    <Popconfirm
                        key="delete"
                        title="Bạn có chắc muốn xoá nhân sự này?"
                        okText="Xoá"
                        cancelText="Không"
                        onConfirm={() => onDelete(editingUser.id)}
                    >
                        <Button danger icon={<DeleteOutlined />}>
                            Xoá
                        </Button>
                    </Popconfirm>
                ),
                <Button key="cancel" onClick={onCancel}>
                    Huỷ
                </Button>,
                <Button key="ok" type="primary" onClick={handleSave}>
                    Lưu
                </Button>,
            ]}>
            <Form form={form} layout="vertical">
                <Form.Item name="name" label="Tên nhân sự" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="avatar"
                    label="Ảnh đại diện"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                >
                    <Upload accept="image/png, image/jpeg, image/jpg, image/gif" beforeUpload={() => false} listType="picture" maxCount={1}>
                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </Upload>
                </Form.Item>
                <Form.Item name="department" label="Phòng ban" rules={[{ required: true, message: "Vui lòng chọn phòng ban" }]}>
                    <Select placeholder="Chọn phòng ban">
                        {departments?.map((d) => (
                            <Option key={d.id} value={d.id}>
                                {d.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="role" label="Chức vụ" rules={[{ required: true, message: "Vui lòng chọn chức vụ" }]}>
                    <Select placeholder="Chọn chức vụ">
                        {roles?.map((r) => (
                            <Option key={r.id} value={r.id}>
                                {r.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="isActive" label="Trạng thái" valuePropName="checked">
                    <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PersonnelModal;
