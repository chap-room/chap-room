import { ReactElement } from "react";
import Head from "next/head";
import { Post } from "@/shared/types";
import DashboardLayout from "@/admin/components/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import PostGrid from "@/admin/components/PostList";

export default function DashboardBlog() {
  return (
    <>
      <Head>
        <title>داشبورد - وبلاگ</title>
      </Head>
      <SectionHeader
        title="وبلاگ"
        description="وبلاگ را از این بخش مدیریت کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader title="همه نوشته ها" />
        <MobileContentHeader backTo="/dashboard" title="همه نوشته ها" />
        <PostGrid
          posts={
            [
              {
                id: 1,
                author: { id: 0, name: "علی ساکی" },
                title: 'چاپ کتاب با یک کلیک!',
                countOfViews: 20,
                thumbnailUrl: "http://localhost:3000/assets/images/post-thumbnail.jpg",
                thumbnailAlt: "",
                categories: [{id: 1, name: "تست 1"}, {id: 2, name: "تست 2"}],
                excerpt:
                  "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است",
              },
              {
                id: 2,
                author: { id: 0, name: "علی ساکی" },
                title: 'چاپ کتاب با یک کلیک!',
                countOfViews: 20,
                thumbnailUrl: "http://localhost:3000/assets/images/post-thumbnail.jpg",
                thumbnailAlt: "",
                categories: [{id: 1, name: "تست 1"}, {id: 2, name: "تست 2"}],
                excerpt:
                  "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است",
              },
              {
                id: 3,
                author: { id: 0, name: "علی ساکی" },
                title: 'چاپ کتاب با یک کلیک!',
                countOfViews: 20,
                thumbnailUrl: "http://localhost:3000/assets/images/post-thumbnail.jpg",
                thumbnailAlt: "",
                categories: [{id: 1, name: "تست 1"}, {id: 2, name: "تست 2"}],
                excerpt:
                  "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است",
              },
              {
                id: 4,
                author: { id: 0, name: "علی ساکی" },
                title: 'چاپ کتاب با یک کلیک!',
                countOfViews: 20,
                thumbnailUrl: "http://localhost:3000/assets/images/post-thumbnail.jpg",
                thumbnailAlt: "",
                categories: [{id: 1, name: "تست 1"}, {id: 2, name: "تست 2"}],
                excerpt:
                  "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است",
              },
              {
                id: 5,
                author: { id: 0, name: "علی ساکی" },
                title: 'چاپ کتاب با یک کلیک!',
                countOfViews: 20,
                thumbnailUrl: "http://localhost:3000/assets/images/post-thumbnail.jpg",
                thumbnailAlt: "",
                categories: [{id: 1, name: "تست 1"}, {id: 2, name: "تست 2"}],
                excerpt:
                  "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است",
              },
              {
                id: 6,
                author: { id: 0, name: "علی ساکی" },
                title: 'چاپ کتاب با یک کلیک!',
                countOfViews: 20,
                thumbnailUrl: "http://localhost:3000/assets/images/post-thumbnail.jpg",
                thumbnailAlt: "",
                categories: [{id: 1, name: "تست 1"}, {id: 2, name: "تست 2"}],
                excerpt:
                  "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است",
              },
              {
                id: 7,
                author: { id: 0, name: "علی ساکی" },
                title: 'چاپ کتاب با یک کلیک!',
                countOfViews: 20,
                thumbnailUrl: "http://localhost:3000/assets/images/post-thumbnail.jpg",
                thumbnailAlt: "",
                categories: [{id: 1, name: "تست 1"}, {id: 2, name: "تست 2"}],
                excerpt:
                  "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است",
              },
              {
                id: 8,
                author: { id: 0, name: "علی ساکی" },
                title: 'چاپ کتاب با یک کلیک!',
                countOfViews: 20,
                thumbnailUrl: "http://localhost:3000/assets/images/post-thumbnail.jpg",
                thumbnailAlt: "",
                categories: [{id: 1, name: "تست 1"}, {id: 2, name: "تست 2"}],
                excerpt:
                  "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است",
              },
              {
                id: 9,
                author: { id: 0, name: "علی ساکی" },
                title: 'چاپ کتاب با یک کلیک!',
                countOfViews: 20,
                thumbnailUrl: "http://localhost:3000/assets/images/post-thumbnail.jpg",
                thumbnailAlt: "",
                categories: [{id: 1, name: "تست 1"}, {id: 2, name: "تست 2"}],
                excerpt:
                  "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است",
              },
              {
                id: 10,
                author: { id: 0, name: "علی ساکی" },
                title: 'چاپ کتاب با یک کلیک!',
                countOfViews: 20,
                thumbnailUrl: "http://localhost:3000/assets/images/post-thumbnail.jpg",
                thumbnailAlt: "",
                categories: [{id: 1, name: "تست 1"}, {id: 2, name: "تست 2"}],
                excerpt:
                  "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است",
              },
              {
                id: 11,
                author: { id: 0, name: "علی ساکی" },
                title: 'چاپ کتاب با یک کلیک!',
                countOfViews: 20,
                thumbnailUrl: "http://localhost:3000/assets/images/post-thumbnail.jpg",
                thumbnailAlt: "",
                categories: [{id: 1, name: "تست 1"}, {id: 2, name: "تست 2"}],
                excerpt:
                  "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است",
              },
              {
                id: 12,
                author: { id: 0, name: "علی ساکی" },
                title: 'چاپ کتاب با یک کلیک!',
                countOfViews: 20,
                thumbnailUrl: "http://localhost:3000/assets/images/post-thumbnail.jpg",
                thumbnailAlt: "",
                categories: [{id: 1, name: "تست 1"}, {id: 2, name: "تست 2"}],
                excerpt:
                  "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است",
              },
            ] as unknown as Post[]
          }
          onDeletePost={() => {}}
          onEditPost={() => {}}
        />
      </SectionContent>
    </>
  );
}

DashboardBlog.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
