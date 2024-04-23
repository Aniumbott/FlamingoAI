import { colors } from "@clerk/themes/dist/clerk-js/src/ui/foundations/colors";
import { Text, useMantineColorScheme } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { Mention, MentionsInput } from "react-mentions";
import reactStringReplace from "react-string-replace";

export function MentionParser(text: string) {
  const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;

  text = text.replace(mentionRegex, "<this>@$1</this>");

  // now replace all with <this>...</this>
  const thisMatch = /<this>(.*?)<\/this>/g;
  const replacedText = reactStringReplace(text, thisMatch, (match, i, name) => (
    <Text
      key={i}
      px={2}
      mx={3}
      style={{
        background: "var(--mantine-primary-color-filled)",
      }}
    >
      {match}
    </Text>
  ));

  return (
    <Text size="sm">
      <div className="flex flex-row flex-wrap ">{replacedText}</div>
    </Text>
  );
}

export default function MentionInput(props: {
  commentText: string;
  setCommentText: any;
  participants: any[];
}) {
  const { commentText, setCommentText, participants } = props;
  const { colorScheme } = useMantineColorScheme();
  const style = {
    control: {
      backgroundColor:
        colorScheme == "dark" ? "var(--mantine-color-dark-6)" : "white",
      fontSize: 14,
      height: "100%",
      fontWeight: "normal",
    },

    "&multiLine": {
      control: {
        minHeight: 63,
      },
      highlighter: {
        padding: 9,
        border: "1px solid transparent",
      },
      input: {
        padding: 9,
        border: "1px solid ",
        borderColor:
          colorScheme == "dark"
            ? "var(--mantine-color-dark-4)"
            : "var(--mantine-color-dark-1)",
        borderRadius: 4,
        // focus
        "&focused": {
          borderColor: "var(--mantine-primary-color-filled)",
        },
      },
    },

    suggestions: {
      list: {
        color: "black",
        backgroundColor: "white",
        fontSize: 12,
      },
      item: {
        padding: "5px 10px",
        borderBottom: "1px solid rgba(0,0,0,0.15)",
        "&focused": {
          color: "white",
          backgroundColor: "var(--mantine-primary-color-filled)",
        },
      },
    },
  };

  return (
    <MentionsInput
      value={commentText}
      onChange={(e) => setCommentText(e.target.value)}
      placeholder={"Mention people using '@'"}
      a11ySuggestionsListLabel={"Suggested mentions"}
      style={style}
      className="w-full h-full"
    >
      <Mention
        trigger="@"
        displayTransform={(id, display) => ` @${display} `}
        data={
          participants.map((participant) => ({
            id: participant.userId,
            display: `${participant.firstName} ${participant.lastName}`,
          })) || []
        }
        style={{
          backgroundColor: "var(--mantine-primary-color-filled)",
        }}
      />
    </MentionsInput>
  );
}
