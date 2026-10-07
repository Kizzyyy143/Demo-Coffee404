import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, UserCheck, Mail, Phone, X } from 'lucide-react';
import Header from '../../components/Header';
import { employeesAPI } from '../../services/api';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: 'Barista',
    salary: 2500,
    shift: 'Morning',
  });

  const fetchEmployees = async () => {
    try {
      const data = await employeesAPI.getAll();
      setEmployees(data);
    } catch (err) {
      console.error('Failed to load employees', err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleOpenAdd = () => {
    setEditingEmployee(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: 'Barista',
      salary: 2500,
      shift: 'Morning',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name,
      email: emp.email,
      phone: emp.phone || '',
      position: emp.position || 'Barista',
      salary: emp.salary || 2500,
      shift: emp.shift || 'Morning',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete employee record?')) {
      try {
        await employeesAPI.delete(id);
        fetchEmployees();
      } catch (err) {
        console.error('Failed to delete employee', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        salary: parseFloat(formData.salary),
      };
      if (editingEmployee) {
        await employeesAPI.update(editingEmployee.id, payload);
      } else {
        await employeesAPI.create(payload);
      }
      setShowModal(false);
      fetchEmployees();
    } catch (err) {
      console.error('Failed to save employee', err);
    }
  };

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.position.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page-content">
      <Header title="Staff & Barista Roster" />

      <div className="admin-body">
        <div className="admin-toolbar">
          <div className="admin-search-wrap">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by staff name or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} /> Add Employee
          </button>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Position</th>
                <th>Assigned Shift</th>
                <th>Monthly Salary</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <strong className="block">{emp.name}</strong>
                  </td>
                  <td>
                    <span className="badge-position">{emp.position}</span>
                  </td>
                  <td>
                    <span className={`badge-shift ${emp.shift.toLowerCase()}`}>{emp.shift}</span>
                  </td>
                  <td className="font-semibold">${Number(emp.salary).toLocaleString()}</td>
                  <td>
                    <div className="contact-cell">
                      <span><Mail size={13} /> {emp.email}</span>
                      {emp.phone && <span><Phone size={13} /> {emp.phone}</span>}
                    </div>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button onClick={() => handleOpenEdit(emp)} className="btn-icon-edit"><Edit2 size={15} /></button>
                      <button onClick={() => handleDelete(emp.id)} className="btn-icon-del"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingEmployee ? 'Edit Staff Member' : 'Add New Staff Member'}</h3>
              <button onClick={() => setShowModal(false)} className="close-btn"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Position</label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  >
                    <option value="Lead Barista">Lead Barista</option>
                    <option value="Barista">Barista</option>
                    <option value="Store Manager">Store Manager</option>
                    <option value="Cashier">Cashier</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Shift Schedule</label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                  >
                    <option value="Morning">Morning (06:30 - 14:30)</option>
                    <option value="Afternoon">Afternoon (14:00 - 22:00)</option>
                    <option value="Evening">Evening (16:00 - 00:00)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Monthly Salary ($)</label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;

