
USE demoapp;
GO

-- Authorities
INSERT INTO Authorities (name) VALUES
(N'Admin'),
(N'Manager'),
(N'Staff');

-- Competency
INSERT INTO Competency (name) VALUES
(N'Kỹ năng giao tiếp'),
(N'Làm việc nhóm'),
(N'Giải quyết vấn đề');

-- Criteria (tham chiếu Competency)
INSERT INTO Criteria (idCompetency, name) VALUES
(1, N'Trình bày rõ ràng'),
(2, N'Hợp tác với đồng nghiệp'),
(3, N'Tìm giải pháp sáng tạo');

-- Departments
INSERT INTO Departments (name) VALUES
(N'Phòng Nhân sự'),
(N'Phòng IT'),
(N'Phòng Kinh doanh');

-- Roles
INSERT INTO Roles (name) VALUES
(N'Giám đốc'),
(N'Trưởng phòng'),
(N'Nhân viên');

-- Employee (tham chiếu Departments, Roles)
INSERT INTO Employee (idDepartment, idRole, isActive, birthday, avatar, email, name, password, phone) VALUES
(1, 1, 1, '1985-05-10', NULL, 'gd@company.com', N'Nguyễn Văn A', '123456', '0909000001'),
(2, 2, 1, '1990-03-15', NULL, 'tpit@company.com', N'Trần Thị B', '123456', '0909000002'),
(3, 3, 1, '1995-07-20', NULL, 'nvkd@company.com', N'Lê Văn C', '123456', '0909000003');

-- EmployeeAuthority (tham chiếu Employee + Authorities)
INSERT INTO EmployeeAuthority (idAuthority, idEmployee, note) VALUES
(1, 1, N'Toàn quyền'),
(2, 2, N'Quản lý IT'),
(3, 3, N'Nhân viên KD');

-- Result
INSERT INTO Result (name) VALUES
(N'Đạt'),
(N'Chưa đạt'),
(N'Xuất sắc');

-- Report (tham chiếu Competency, Employee)
INSERT INTO Report (idCompetency, idEmployee, idEmployeeReported, date) VALUES
(1, 2, 3, '2025-09-01'),
(2, 1, 2, '2025-09-10');

-- ReportsDetail (tham chiếu Report, Criteria, Result)
INSERT INTO ReportsDetail (idCriteria, idReport, idResult) VALUES
(1, 1, 3),
(2, 2, 1);
