import styles from "./style.module.scss";
import { PostCategory } from "@/shared/types";
import { formatNumber } from "@/shared/utils/format";
import DeletetIcon from "@/shared/assets/icons/delete.svg";
import IconButton from "@/shared/components/IconButton";

interface PostCategoryTableProps {
  categories: PostCategory[];
  onDeletePostCategory: (categoryId: number) => void;
  startCountFrom?: number;
}

export default function PostCategoryTable({
  categories,
  onDeletePostCategory,
  startCountFrom = 1,
}: PostCategoryTableProps) {
  return (
    <table className={styles.PostCategoryTable}>
      <thead>
        <tr>
          <th>#</th>
          <th>نام دسته بندی</th>
          <th>تعداد بلاگ در این دسته بندی</th>
          <th style={{ width: "1%" }}>عملیات</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category, index) => (
          <tr key={category.id}>
            <td>
              <span className={styles.MobileLabel}>#:</span>
              <div>{startCountFrom + index}</div>
            </td>
            <td>
              <span className={styles.MobileLabel}>نام دسته بندی:</span>
              <div>{category.name}</div>
            </td>
            <td>
              <span className={styles.MobileLabel}>تعداد بلاگ:</span>
              <div>{formatNumber(category.countOfBlogs)}</div>
            </td>
            <td>
              <span className={styles.MobileLabel}>عملیات:</span>
              <div className={styles.OperationButtons}>
                <div className={styles.DeleteButton}>
                  <IconButton
                    varient="none"
                    size={34}
                    onClick={() => onDeletePostCategory(category.id)}
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
