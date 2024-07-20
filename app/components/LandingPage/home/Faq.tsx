import React from "react";
import { Accordion, List, Title, Container } from "@mantine/core";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";

const Faq = () => {
  return (
    <Container mt="5rem" w={"100%"} p="0" className="">
      <Title ta="center" order={1} mb={"xl"}>
        Frequently Asked Questions
      </Title>

      <Accordion variant="separated" maw={"calc(min(100%, 700px))"} mx={"auto"}>
        <Accordion.Item
          className=" rounded-md mb-2 border border-gray-300"
          value="free-Flamingo.ai"
        >
          <Accordion.Control>Can I try Flamingo.ai for free?</Accordion.Control>
          <Accordion.Panel p={10}>
            Absolutely, Flamingo.ai is free for up to 2 people. Sign up and try
            it with a another person to explore all the possibilities for
            collaboration. The platform is designed to facilitate collaboration
            for teams of any size.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item
          className=" rounded-md mb-2 border border-gray-300"
          value="training-resources"
        >
          <Accordion.Control>
            Are there any training materials or resources available to help my
            team adopt Flamingo.ai?
          </Accordion.Control>
          <Accordion.Panel p={10}>
            Flamingo.ai is built to simplify the complexities of AI. With
            Flamingo.ai anyone can become an expert in AI and find value in it.
            Just send them an invite and Flamingo.ai will take care of
            onboarding them with out ChatGPT for Work interactive course. The
            course is FREE and is integrated into the Flamingo.ai platform.
            Thanks to it many non-technical users have discovered the magic of
            AI collaboration. We also provide an extensive Knowledge Base filled
            with various resources to help you onboard your whole team into
            Flamingo.ai.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item
          className=" rounded-md mb-2 border border-gray-300"
          value="subscription-required"
        >
          <Accordion.Control>
            Is a ChatGPT subscription required to use Flamingo.ai?
          </Accordion.Control>
          <Accordion.Panel p={10}>
            <p>
              No, you don&rsquo;t need a ChatGPT Plus subscription to use
              Flamingo.ai.
            </p>
            <p>
              Instead, you need to obtain an API key from OpenAI, which you can
              get here. After connecting your API key to Flamingo.ai, you can
              use the system and pay OpenAI for your usage. You&rsquo;ll be
              billed at the end of the month based on your actual usage, which
              can be more cost-effective, especially if you&rsquo;re
              collaborating with other people.
            </p>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item
          className=" rounded-md mb-2 border border-gray-300"
          value="AI-model"
        >
          <Accordion.Control>
            Can I chat with more than one AI model?
          </Accordion.Control>
          <Accordion.Panel p={10}>
            <p>
              You will not be able to use Flamingo.ai without setting an OpenAI
              API key.
            </p>
            <p>
              After signing into Flamingo.ai, go to the &quot;Set API key&quot;
              menu. From there, you can enter your API key in the appropriate
              field and save the changes. This will connect your OpenAI API key
              to Flamingo.ai, allowing you to use the platform.
            </p>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item
          className=" rounded-md mb-2 border border-gray-300"
          value="why-Flamingo.ai"
        >
          <Accordion.Control>
            Why should I use Flamingo.ai, instead of ChatGPT?
          </Accordion.Control>
          <Accordion.Panel p={10}>
            <p>
              ChatGPT Plus doesn&apos;t have a team plan. You can only use it
              individually. As a team owner, you can even pay for your
              colleague&apos;s ChatGPT Plus subscription.
            </p>

            <p>Full Flamingo.ai vs ChatGPT comparison table.</p>

            <p>
              Flamingo.ai is a platform that allows you to collaborate with your
              team using ChatGPT. If you have someone to collaborate with,
              Flamingo.ai can help you make better use of ChatGPT.
            </p>

            <p>
              The models used by Flamingo.ai are provided by OpenAI&apos;s
              ChatGPT API. Therefore, all interactions made through Flamingo.ai
              are equivalent to those made through the ChatGPT UI available at
              https://chat.openai.com/.
            </p>

            <p>
              The value that Flamingo.ai provides is related to human
              collaboration. The model output is 100% the same.
            </p>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item
          className=" rounded-md mb-2 border border-gray-300"
          value="after-signup"
        >
          <Accordion.Control>
            What should I do after signing up for Flamingo.ai?
          </Accordion.Control>
          <Accordion.Panel p={10}>
            <List type="ordered" spacing={"md"}>
              <List.Item>Log in with your credentials. Log in.</List.Item>
              <List.Item>
                Set your API key (create one here if needed).
              </List.Item>
              <List.Item>Invite team members.</List.Item>
              <List.Item>Start collaborating in Flamingo.ai.</List.Item>
            </List>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default Faq;
