import { Text, Title, Paper } from "@mantine/core";
import { BarChart } from "@mantine/charts";
import { useEffect, useState } from "react";

declare global {
  interface Date {
    getWeek(): number;
  }
}

Date.prototype.getWeek = function () {
  const date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const week1 = new Date(date.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
};

function constructActiveUsers(
  startDate: Date,
  endDate: Date,
  tokenLogs: any[]
): any[] {
  const rangeDays = Math.ceil(
    (endDate.getTime() - startDate.getTime() + 1) / (1000 * 60 * 60 * 24)
  );

  const activeUsers = [];

  if (rangeDays <= 7) {
    for (
      let d = startDate;
      d <= endDate || d.toLocaleDateString() == endDate.toLocaleDateString();
      d.setDate(d.getDate() + 1)
    ) {
      const localDateString = d.toLocaleDateString();
      const users = new Set(
        tokenLogs
          .filter(
            (usage) =>
              new Date(usage.createdAt).toLocaleDateString() === localDateString
          )
          .map((usage) => usage.createdBy)
      ).size;
      activeUsers.push({ label: localDateString, users });
    }
  } else if (rangeDays <= 31) {
    // Label is week number
    const startWeek = startDate.getWeek();
    const endWeek = endDate.getWeek();
    for (let week = startWeek; week <= endWeek; week++) {
      const users = new Set(
        tokenLogs
          .filter((usage) => new Date(usage.createdAt).getWeek() === week)
          .map((usage) => usage.createdBy)
      ).size;
      activeUsers.push({ label: `Week ${week}`, users });
    }
  } else if (rangeDays < 366) {
    // Label is month
    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    for (let year = startYear; year <= endYear; year++) {
      for (let month = startMonth; month <= endMonth; month++) {
        const users = new Set(
          tokenLogs
            .filter(
              (usage) =>
                new Date(usage.createdAt).getMonth() === month &&
                new Date(usage.createdAt).getFullYear() === year
            )
            .map((usage) => usage.createdBy)
        ).size;
        activeUsers.push({
          label: `${new Date(year, month, 1).toLocaleString("default", {
            month: "long",
          })} ${year}`,
          users,
        });
      }
    }
  } else {
    // Label is year
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    for (let year = startYear; year <= endYear; year++) {
      const users = new Set(
        tokenLogs
          .filter((usage) => new Date(usage.createdAt).getFullYear() === year)
          .map((usage) => usage.createdBy)
      ).size;
      activeUsers.push({ label: `${year}`, users });
    }
  }

  return activeUsers;
}

export default function ActiveUsers(props: {
  dateRange: any[];
  tokenLogs: any[];
}) {
  const { dateRange, tokenLogs } = props;
  const [activeUsers, setActiveUsers] = useState<any>([]);
  useEffect(() => {
    setActiveUsers(
      constructActiveUsers(
        new Date(dateRange[0]),
        new Date(dateRange[1]),
        tokenLogs
      )
    );
  }, [dateRange, tokenLogs]);
  return (
    <Paper
      withBorder
      h="100%"
      w="100%"
      p="2rem"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "space-between",
      }}
    >
      <div className="mb-5">
        <Title order={3}>Active Users</Title>
        <Text size="sm">
          See how many people are active — meaning, they sent a message in a
          chat.
        </Text>
      </div>
      <BarChart
        h={300}
        data={activeUsers}
        dataKey="label"
        yAxisLabel="Users"
        tickLine="y"
        series={[
          {
            name: "users",
            color: "var(--mantine-primary-color-filled)",
          },
        ]}
      />
    </Paper>
  );
}
