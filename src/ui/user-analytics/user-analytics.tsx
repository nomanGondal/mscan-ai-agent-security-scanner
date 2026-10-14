"use client";

import { useTotalCount } from "@/hooks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Box, Text } from "@radix-ui/themes";
import { Users } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Sector,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface PieDataItem {
  name: string;
  value: number;
  fill?: string;
}

interface GrowthDataItem {
  month: string;
  users: number;
}

const dummyGrowthData: GrowthDataItem[] = [
  { month: "July", users: 120 },
  { month: "August", users: 150 },
  { month: "September", users: 200 },
  { month: "October", users: 250 },
  { month: "November", users: 300 },
  { month: "December", users: 400 },
];

const chartConfig: ChartConfig = {
  value: { label: "Users" },
  Free: { label: "Free", color: "#4f46e5" },
  Paid: { label: "Paid", color: "#14b8a6" },
  Pro: { label: "Pro", color: "#facc15" },
};

const UserAnalytics = () => {
  const { isGettingUserCount, totalCount, getUsersCount } = useTotalCount();
  const [pieData, setPieData] = useState<PieDataItem[]>([]);
  const [growthData, setGrowthData] =
    useState<GrowthDataItem[]>(dummyGrowthData);

  useEffect(() => {
    getUsersCount();
    const fetchPieData = async () => {
      try {
        const res = await fetch("/api/user-analytics/user-paid-free");
        const data = await res.json();
        if (data.success) {
          const mapped = data.data.map((item: any, index: number) => ({
            ...item,
            fill: ["#4f46e5", "#14b8a6", "#facc15"][index] || "#e5e7eb",
          }));
          setPieData(mapped);
        }
      } catch (err) {
        console.error(err);
      }
    };
    const fetchGrowthData = async () => {
      try {
        const res = await fetch("/api/user-analytics/growth");
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setGrowthData(data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPieData();
    fetchGrowthData();
  }, []);

  return (
    <Box>
      <Box className="px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-10"
        >
          <Box asChild>
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900">
              User Analytics
            </h2>
          </Box>
          <Text className="mt-3 text-gray-500 max-w-xl ml-3">
            Real-time overview of your platform’s registered users.
          </Text>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Users
                </CardTitle>
                <Users className="h-6 w-6 text-gray-400" />
              </CardHeader>
              <CardContent>
                <Text className="text-5xl font-semibold text-gray-900">
                  {isGettingUserCount ? "—" : totalCount}
                </Text>
                <Text size="2" className="mt-2 text-gray-400">
                  Users currently registered on the platform
                </Text>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle>User Growth Over Time</CardTitle>
                <CardDescription>Last 6 months</CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={growthData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#4f46e5"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="text-gray-500 text-sm">
                Showing total users registered each month
              </CardFooter>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Users by Plan</CardTitle>
                <CardDescription>Free / Paid / Pro</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={pieData as any}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      strokeWidth={2}
                      activeIndex={0}
                      activeShape={(props: any) => (
                        <Sector
                          {...props}
                          outerRadius={props.outerRadius + 10}
                        />
                      )}
                    />
                  </PieChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex flex-col gap-1 text-sm text-gray-500">
                Showing total users by subscription plan
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </Box>
    </Box>
  );
};

export { UserAnalytics };
