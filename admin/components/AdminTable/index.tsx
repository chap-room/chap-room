import styles from "./style.module.scss";
import { AdminUserRole } from "@/shared/types";
import LoginIcon from "@/admin/assets/icons/login.svg";
import EditIcon from "@/shared/assets/icons/edit.svg";
import DeletetIcon from "@/shared/assets/icons/delete.svg";
import IconButton from "@/shared/components/IconButton";

interface AdminTableProps {
  admins: {
    id: number;
    name: string;
    phoneNumber: string;
    role: AdminUserRole;
  }[];
  onDeleteAdmin: (adminId: number) => void;
  onLoginAsAdmin: (adminId: number) => void;
  onEditAdmin: (adminId: number) => void;
}

export default function AdminTable({
  admins,
  onDeleteAdmin,
  onLoginAsAdmin,
  onEditAdmin,
}: AdminTableProps) {
  return (
    <table className={styles.AdminTable}>
      <thead>
        <tr>
          <th>کاربر</th>
          <th>نقش</th>
          <th>عملیات</th>
        </tr>
      </thead>
      <tbody>
        {admins.map((admin) => (
          <tr key={admin.id}>
            <td>
              <span className={styles.MobileLabel}>ادمین:</span>
              <div>
                <div className={styles.UserName}>{admin.name}</div>
                <div>{admin.phoneNumber}</div>
              </div>
            </td>
            <td>
              <span className={styles.MobileLabel}>نقش:</span>
              <div>
                {
                  {
                    superAdmin: "سوپر ادمین",
                    admin: "ادمین",
                    agent: "نمایندگی",
                  }[admin.role.name]
                }
              </div>
            </td>
            <td>
              <span className={styles.MobileLabel}>عملیات:</span>
              <div className={styles.OperationButtons}>
                <div className={styles.LogoutButton}>
                  <IconButton
                    varient="none"
                    size={34}
                    onClick={() => onLoginAsAdmin(admin.id)}
                  >
                    <LoginIcon />
                  </IconButton>
                </div>
                <div className={styles.EditButton}>
                  <IconButton
                    varient="none"
                    size={34}
                    onClick={() => onEditAdmin(admin.id)}
                  >
                    <EditIcon />
                  </IconButton>
                </div>
                <div className={styles.DeleteButton}>
                  <IconButton
                    varient="none"
                    size={34}
                    onClick={() => onDeleteAdmin(admin.id)}
                  >
                    <DeletetIcon />
                  </IconButton>
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}