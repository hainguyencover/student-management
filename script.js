class Student {
    constructor(id, mssv, name, className, email, birthday) {
        this.id = id;
        this.mssv = mssv;
        this.name = name;
        this.className = className;
        this.email = email;
        this.birthday = birthday;
    }
}

let students = loadFromLocal() || [
    new Student(1, "CD01", "Nguyễn Văn A", "HTML", "a@gmail.com", "2000-01-01"),
    new Student(2, "CD02", "Nguyễn Văn B", "CSS", "b@gmail.com", "2000-02-02"),
    new Student(3, "CD03", "Nguyễn Văn C", "JavaScript", "c@gmail.com", "2000-03-03")
];

let editingIndex = -1;

function renderStudents(list = students) {
    const tableBody = document.getElementById("productList");
    tableBody.innerHTML = "";

    if (list.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:red;">Không có học viên nào</td></tr>`;
        return;
    }

    for (let i = 0; i < list.length; i++) {
        const student = list[i];
        const indexInStudents = students.findIndex(s => s.mssv === student.mssv);

        tableBody.innerHTML += `<tr>
            <td>${i + 1}</td>
            <td>${student.mssv}</td>
            <td>${student.name}</td>
            <td>${student.className}</td>
            <td>${student.email}</td>
            <td>${student.birthday}</td>
            <td><button type="button" class="edit-btn" onclick="editStudent(${indexInStudents})"><i class="fas fa-edit"></i> Sửa</button></td>
            <td><button type="button" class="delete-btn" onclick="deleteStudent(${indexInStudents})"><i class="fas fa-trash-alt"></i> Xóa</button></td>
            </tr>`;
    }
}

function btnADD(e) {
    e.preventDefault();

    const mssv = document.getElementById("inputMssv").value.trim();
    const name = document.getElementById("inputName").value.trim();
    const className = document.getElementById("inputClass").value;
    const email = document.getElementById("inputEmail").value.trim();
    const birthday = document.getElementById("inputBirthday").value;

    if (!mssv || !name || !className || !email || !birthday) {
        alert("Vui lòng nhập đầy đủ thông tin.");
        return false;
    }

    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(name)) {
        alert("Tên không hợp lệ.");
        return false;
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        alert("Email không hợp lệ.");
        return false;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
        alert("Ngày sinh không hợp lệ (định dạng yyyy-mm-dd).");
        return false;
    }

    if (editingIndex !== -1) {
        students[editingIndex].mssv = mssv;
        students[editingIndex].name = name;
        students[editingIndex].className = className;
        students[editingIndex].email = email;
        students[editingIndex].birthday = birthday;
        editingIndex = -1;
        document.getElementById("btnAddBtn").innerText = "Thêm mới học viên";

    } else {
        if (students.some(s => s.mssv === mssv)) {
            alert("Mã học viên đã tồn tại!");
            return false;
        }
        const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
        students.push(new Student(newId, mssv, name, className, email, birthday));
    }

    saveToLocal();
    document.getElementById("formNhap").reset();
    renderStudents();

    return false;
}


function editStudent(index) {
    const s = students[index];
    document.getElementById("inputMssv").value = s.mssv;
    document.getElementById("inputName").value = s.name;
    document.getElementById("inputClass").value = s.className;
    document.getElementById("inputEmail").value = s.email;
    document.getElementById("inputBirthday").value = s.birthday;

    editingIndex = index;
    document.getElementById("btnADD").innerText = "Cập nhật học viên";
}

function deleteStudent(index) {
    if (confirm(`Bạn có chắc chắn muốn xóa học viên ${students[index].name}?`)) {
        students.splice(index, 1);
        saveToLocal();
        renderStudents();
    }
}

function btnSEARCH(e) {
    e.preventDefault();
    const keyword = document.getElementById("inputSearch").value.trim().toLowerCase();

    const filtered = students.filter(s =>
        s.name.toLowerCase().includes(keyword) ||
        s.mssv.toLowerCase().includes(keyword) ||
        s.className.toLowerCase().includes(keyword) ||
        s.email.toLowerCase().includes(keyword)
    );

    renderStudents(filtered);
}

function resetSearch() {
    document.getElementById("inputSearch").value = "";
    renderStudents();
}

// LocalStorage functions
function saveToLocal() {
    localStorage.setItem('students', JSON.stringify(students));
}

function loadFromLocal() {
    return JSON.parse(localStorage.getItem('students'));
}

window.onload = () => {
    renderStudents();
};
