import type { LucideIcon } from "lucide-react";

import type { RolePermission } from "./CreateRole.types";


interface RolePermissionCardProps {
    permission: RolePermission;
    icon: LucideIcon;
    onToggle: (id: string) => void;
}


const RolePermissionCard = ({
    permission,
    icon: Icon,
    onToggle,
}: RolePermissionCardProps) => {

    return (

        <div className="col-12 col-md-6">

            <div className="role-permission-card">

                <div className="role-permission-content">

                    <div className="role-permission-icon">
                        <Icon
                            size={18}
                            strokeWidth={2}
                        />
                    </div>


                    <div className="role-permission-info">

                        <h3 className="role-permission-info-title">
                            {permission.title}
                        </h3>

                        <p className="role-permission-info-para">
                            {permission.description}
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    className={`role-permission-toggle ${
                        permission.enabled ? "active" : ""
                    }`}
                    onClick={() => onToggle(permission.id)}
                    aria-label={`${
                        permission.enabled
                            ? "Disable"
                            : "Enable"
                    } ${permission.title} permission`}
                    aria-pressed={permission.enabled}
                >
                    <span />
                </button>

            </div>
        </div>
    );
};


export default RolePermissionCard;