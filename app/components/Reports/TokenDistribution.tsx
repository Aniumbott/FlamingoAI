import { Paper, Title, Text } from "@mantine/core";
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

function constructTokenUsage(
  startDate: Date,
  endDate: Date,
  tokenLogs: any[]
): any[] {
  const rangeDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const tokenUsage = [];

  if (rangeDays <= 7) {
    for (
      let d = startDate;
      d <= endDate || d.toLocaleDateString() == endDate.toLocaleDateString();
      d.setDate(d.getDate() + 1)
    ) {
      const localDateString = d.toLocaleDateString();
      let input: number = 0;
      let output: number = 0;
      tokenLogs.forEach((usage) => {
        if (
          new Date(usage.createdAt).toLocaleDateString() === localDateString
        ) {
          input += Number(usage.inputTokens);
          output += Number(usage.outputTokens);
        }
      });
      tokenUsage.push({ label: localDateString, input: input, output: output });
    }
  } else if (rangeDays <= 31) {
    // Label is week number
    const startWeek = startDate.getWeek();
    const endWeek = endDate.getWeek();
    for (let week = startWeek; week <= endWeek; week++) {
      let input: number = 0;
      let output: number = 0;
      tokenLogs.forEach((usage) => {
        if (new Date(usage.createdAt).getWeek() === week) {
          input += Number(usage.inputTokens);
          output += Number(usage.outputTokens);
        }
      });
      tokenUsage.push({ label: `Week ${week}`, input: input, output: output });
    }
  } else if (rangeDays < 366) {
    // Label is month
    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    for (let year = startYear; year <= endYear; year++) {
      for (let month = startMonth; month <= endMonth; month++) {
        let input: number = 0;
        let output: number = 0;
        tokenLogs.forEach((usage) => {
          if (
            new Date(usage.createdAt).getMonth() === month &&
            new Date(usage.createdAt).getFullYear() === year
          ) {
            input += Number(usage.inputTokens);
            output += Number(usage.outputTokens);
          }
        });

        tokenUsage.push({
          label: `${new Date(year, month, 1).toLocaleString("default", {
            month: "long",
          })} ${year}`,
          input: input,
          output: output,
        });
      }
    }
  } else {
    // Label is year
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    for (let year = startYear; year <= endYear; year++) {
      let input: number = 0;
      let output: number = 0;
      tokenLogs.forEach((usage) => {
        if (new Date(usage.createdAt).getFullYear() === year) {
          input += Number(usage.inputTokens);
          output += Number(usage.outputTokens);
        }
      });
      tokenUsage.push({ label: `${year}`, input: input, output: output });
    }
  }
  return tokenUsage;
}

export default function TokenDistribution(props: {
  dateRange: any[];
  tokenLogs: any[];
}) {
  const { dateRange, tokenLogs } = props;
  const [tokenDistribution, setTokenDistribution] = useState<any[]>([
    {
      label: "Week 1",
      input: 100,
      output: 50,
    },
    {
      label: "Week 2",
      input: 200,
      output: 150,
    },
    {
      label: "Week 3",
      input: 100,
      output: 30,
    },
    {
      label: "Week 4",
      input: 160,
      output: 50,
    },
    {
      label: "Week 5",
      input: 300,
      output: 150,
    },
  ]);
  useEffect(() => {
    setTokenDistribution(
      constructTokenUsage(
        new Date(dateRange[0]),
        new Date(dateRange[1]),
        tokenLogs
      )
    );
  }, [dateRange, tokenLogs]);
  return (
    <Paper
      withBorder
      mt="1rem"
      h="auto"
      w="100%"
      p="2rem"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "space-between",
      }}
    >
      <Title order={3}>Token Distribution Overview</Title>
      <Text mt="1rem" size="sm">
        See the token usage breakdown by type. Input tokens are almost always
        more than output tokens, because each new message sent in the chat
        contains the previous messages as context. Tokens can be converted to
        cost. See your cost in OpenAI.
      </Text>
      <BarChart
        type="stacked"
        dataKey="label"
        h={300}
        mt="2rem"
        xAxisLabel="Ammount"
        data={tokenDistribution}
        barProps={{}}
        series={[
          { name: "input", color: "var(--mantine-primary-color-filled)" },
          { name: "output", color: "yellow" },
        ]}
      ></BarChart>
    </Paper>
  );
}
