import styles from "./style.module.scss";
import { FormattedNumber } from "react-intl";
import LogoutIcon from "@/shared/assets/icons/logout.svg";
import EditIcon from "@/shared/assets/icons/edit.svg";
import DeletetIcon from "@/shared/assets/icons/delete.svg";
import { User } from "@/shared/types";
import IconButton from "@/shared/components/IconButton";

interface UserTableProps {
  users: User[];
  onSeeUserMarketingDetails: (userId: string) => void;
  onSeeUserOrderList: (userId: string) => void;
  onSeeUserAddressList: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onLogoutUser: (userId: string) => void;
  onEditUser: (userId: string) => void;
}

export default function UserTable({
  users,
  onSeeUserMarketingDetails,
  onSeeUserOrderList,
  onSeeUserAddressList,
  onDeleteUser,
  onLogoutUser,
  onEditUser,
}: UserTableProps) {
  return (
    <table className={styles.UserTable}>
      <thead>
        <tr>
          <th>کاربر</th>
          <th>موجودی</th>
          <th>آدرس ها</th>
          <th>سفارش ها</th>
          <th>عملیات</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>
              <span className={styles.MobileLabel}>کاربر:</span>
              <div>
                <div className={styles.UserName}>{user.name}</div>
                <div className={styles.UserPhoneNumber}>{user.phoneNumber}</div>
              </div>
            </td>
            <td>
              <span className={styles.MobileLabel}>موجودی:</span>
              <div className={styles.UserWallet}>
                <div>
                  <FormattedNumber
                    value={user.wallet.balance + user.wallet.marketingSales}
                  />{" "}
                  تومان
                </div>
                <div>
                  <div>
                    <span>کیف پول:</span>
                    <span>
                      <FormattedNumber value={user.wallet.balance} /> تومان
                    </span>
                  </div>
                  <span className={styles.Spacer} />
                  <div>
                    <span>بازاریابی:</span>
                    <span>
                      <FormattedNumber value={user.wallet.marketingSales} />{" "}
                      تومان
                    </span>
                  </div>
                </div>
              </div>
            </td>
            <td>
              <button
                className={styles.SeeUserAddressesButton}
                onClick={() => onSeeUserAddressList(user.id)}
              >
                مشاهده
                <span className={styles.MobileLabel}>آدرس ها</span>
              </button>
            </td>
            <td>
              <button
                className={styles.SeeUserOrdersButton}
                onClick={() => onSeeUserOrderList(user.id)}
              >
                مشاهده
                <span className={styles.MobileLabel}>سفارش ها</span>
              </button>
            </td>
            <td>
              <span className={styles.MobileLabel}>عملیات:</span>
              <div className={styles.OperationButtons}>
                <div className={styles.LogoutButton}>
                  <IconButton
                    varient="none"
                    size={34}
                    onClick={() => onLogoutUser(user.id)}
                  >
                    <LogoutIcon />
                  </IconButton>
                </div>
                <div className={styles.EditButton}>
                  <IconButton
                    varient="none"
                    size={34}
                    onClick={() => onEditUser(user.id)}
                  >
                    <EditIcon />
                  </IconButton>
                </div>
                <div className={styles.DeleteButton}>
                  <IconButton
                    varient="none"
                    size={34}
                    onClick={() => onDeleteUser(user.id)}
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
