"use client";
import { BookOpen, PieChart } from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { HRHeroLogo } from "./hr-hero-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "Admin",
    email: "admin@hrhero.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Onboarding",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Resume Analyzer",
          url: "/dashboard/resume-analyzer",
        },
        {
          title: "Assessment Curator",
          url: "/dashboard/assessment-curator",
        },
        {
          title: "Result Analyzer",
          url: "/dashboard/result-analyzer",
        },
      ],
    },
    {
      title: "Engagement",
      url: "#",
      icon: PieChart,
      items: [
        {
          title: "Monthly Survey",
          url: "/dashboard/monthly-survey",
        },
        {
          title: "Exit Interview Analyser",
          url: "/dashboard/exit-interview-analyser",
        },
        // {
        //   title: "Analysis",
        //   url: "/dashboard/analysis",
        // },
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <HRHeroLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
