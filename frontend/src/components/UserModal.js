import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import {
    Button,
    Checkbox,
    DatePicker,
    Form,
    Input,
    Modal,
    Popconfirm,
    Select,
    Switch,
    Upload,
    message
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getDepartmentList } from "../api/departmentAPI";
import { checkAssetOther, createEmployee, updateEmployee } from "../api/employeeAPI";
import { getRoleList } from "../api/roleAPI";
const { Option } = Select;

const UserModal = ({ open, onOk, onCancel, onDelete, editingUser, form }) => {
    const roleValue = Form.useWatch("role", form);
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

    // load quyền khi edit
    useEffect(() => {
        const fetchAuthority = async () => {
            if (editingUser?.id) {
                const hasAuth = await checkAssetOther(editingUser.id);
                form.setFieldsValue({
                    hasAuthority: !!hasAuth,
                });
            } else {
                form.setFieldsValue({ hasAuthority: false });
            }
        };
        fetchAuthority();
    }, [editingUser, form]);

    // khi mở modal -> fill dữ liệu user
    useEffect(() => {
        if (editingUser) {
            form.setFieldsValue({
                ...editingUser,
                birthday: editingUser.birthday ? dayjs(editingUser.birthday) : null,
                department: editingUser.department?.id,
                role: editingUser.role?.id,
                avatar: editingUser.avatar
                    ? [
                        {
                            uid: "-1",
                            name: "avatar.png",
                            status: "done",
                            url: `http://localhost:8080/images/avatar/${editingUser.avatar}`,
                            // 👆 backend trả về tên file, vd "avatar/abc.png"
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
            if (values.birthday) {
                formData.append("birthday", values.birthday.format("YYYY-MM-DD"));
            }

            formData.append("name", values.name);
            formData.append("email", values.email);

            if (!editingUser) {
                formData.append("password", values.password);
            }

            formData.append("phone", values.phone);
            formData.append("department", values.department);
            formData.append("role", values.role);
            formData.append("hasAuthority", values.hasAuthority ? "true" : "false");
            formData.append("isActive", values.isActive ? "true" : "false");
            let updatedUser;

            if (editingUser) {
                // Trường hợp cập nhật
                updatedUser = await updateEmployee(editingUser.id, formData);
                message.success("Cập nhật nhân viên thành công!");
            } else {
                // Trường hợp tạo mới (id không có)
                updatedUser = await createEmployee(formData); // 👈 gửi null hoặc bỏ id
                message.success("Thêm nhân viên thành công!");
            }

            message.success("Cập nhật nhân viên thành công!");
            onOk(updatedUser); // truyền user thật từ backend
        } catch (err) {
            alert(err);
            console.error("Lỗi khi lưu nhân viên:", err);
        }
    };




    return (
        <Modal
            title={editingUser ? "Sửa nhân viên" : "Thêm nhân viên"}
            open={open}
            onCancel={onCancel}
            okText="Lưu"
            cancelText="Huỷ"
            onOk={handleSave}
            footer={[
                editingUser && (
                    <Popconfirm
                        key="delete"
                        title="Bạn có chắc muốn xoá nhân viên này?"
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
                <Form.Item
                    name="name"
                    label="Tên nhân viên"
                    rules={[{ required: true, message: "Vui lòng nhập tên nhân viên" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, type: "email", message: "Vui lòng nhập email hợp lệ" },
                    ]}
                >
                    <Input />
                </Form.Item>

                {!editingUser && (
                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                    >
                        <Input.Password />
                    </Form.Item>
                )}

                <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, pattern: /^(0)[0-9]{9}$/, message: "Vui lòng nhập số điện thoại hợp lệ" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="birthday"
                    label="Ngày sinh"
                    rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
                >
                    <DatePicker
                        format="DD-MM-YYYY"
                        style={{ width: "100%" }}
                        disabledDate={(current) => current && current > dayjs()}
                    />
                </Form.Item>

                {/* Avatar upload */}
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

                <Form.Item
                    name="department"
                    label="Phòng ban"
                    rules={[{ required: true, message: "Vui lòng chọn phòng ban" }]}
                >
                    <Select placeholder="Chọn phòng ban">
                        {departments?.map((d) => (
                            <Option key={d.id} value={d.id}>
                                {d.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="role"
                    label="Chức vụ"
                    rules={[{ required: true, message: "Vui lòng chọn chức vụ" }]}
                >
                    <Select placeholder="Chọn chức vụ">
                        {roles?.map((r) => (
                            <Option key={r.id} value={r.id}>
                                {r.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="hasAuthority"
                    label="Quyền truy cập chi nhánh khác"
                    valuePropName="checked"
                >
                    <Checkbox disabled={roleValue !== 2}>
                        Được phép truy cập chi nhánh khác
                    </Checkbox>
                </Form.Item>

                <Form.Item name="isActive" label="Trạng thái" valuePropName="checked">
                    <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UserModal;
