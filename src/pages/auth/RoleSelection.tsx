import "./RoleSelection.css";

import { useNavigate } from "react-router-dom";

import adminIcon from "../../assets/images/admin-icon.svg";
import studentIcon from "../../assets/images/student-icon.svg";
import teacherIcon from "../../assets/images/teacher-icon.svg";
import parentIcon from "../../assets/images/parent-icon.svg";

const roles = [
  {
    id: "admin",
    title: "Admin",
    icon: adminIcon,
  },
  {
    id: "student",
    title: "Student",
    icon: studentIcon,
  },
  {
    id: "teacher",
    title: "Teacher",
    icon: teacherIcon,
  },
  {
    id: "parent",
    title: "Parent",
    icon: parentIcon,
  },
];

const RoleSelection = () => {

  const navigate = useNavigate();

  const handleRoleSelect = (role: string) => {
      navigate(`/login/${role}`);
  };

  return (
    <div className="role-selection">
      {roles.map((role) => (
        <label key={role.id} className="role-card">
          <input
            type="radio"
            name="role"
            value={role.id}
            onChange={() => handleRoleSelect(role.id)}
          />

          <div className="role-card-content">
            <div className="role-icon-area">
                {role.icon && <img className="role-icon" src={role.icon} alt={role.title} />}
            </div>
            <h3 className="role-title">{role.title}</h3>
          </div>
        </label>
      ))}
    </div>
  );
};

export default RoleSelection;