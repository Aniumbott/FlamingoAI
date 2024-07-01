import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkGemoji from "remark-gemoji";
import "./Markdown.css";
import { Divider, Table } from "@mantine/core";
export const MessageRender = (props: any) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath, remarkGfm, remarkBreaks, remarkGemoji]}
      className={"markdown"}
      components={{
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag={"div"}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },

        table({ node, children }) {
          return <Table my="lg">{children}</Table>;
        },

        hr({ node, children }) {
          return <Divider size="md" my="0.5rem" />;
        },
      }}
    >
      {props.children}
    </ReactMarkdown>
  );
};
