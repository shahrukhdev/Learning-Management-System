import {
    BookOpen,
    GraduationCap,
    CircleDollarSign,
    Megaphone,
} from "lucide-react";

import RolePermissionCard from "./RolePermissionCard";

import type { RolePermission } from "./CreateRole.types";


interface RolePermissionsProps {
    permissions: RolePermission[];
    onToggle: (id: string) => void;
}


const permissionIcons: Record<string, typeof BookOpen> = {
    academics: BookOpen,
    students: GraduationCap,
    finance: CircleDollarSign,
    communication: Megaphone,
};


const RolePermissions = ({
    permissions,
    onToggle,
}: RolePermissionsProps) => {

    return (

        <div className="col-12">

            <div className="create-role-card">

                <div className="create-role-card-header permission-header">

                    <h2 className="create-role-card-title">
                        Assign Initial Permissions
                    </h2>

                    <span className="permission-helper">
                        Select modules below
                    </span>

                </div>


                <div className="row gy-4">
                    
                    {permissions.map((permission) => {

                        const Icon =
                            permissionIcons[permission.id];

                        return (
                            <RolePermissionCard
                                key={permission.id}
                                permission={permission}
                                icon={Icon}
                                onToggle={onToggle}
                            />
                        );

                    })}

                </div>

            </div>
        </div>
    );
};


export default RolePermissions;