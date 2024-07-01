import { useState } from "react";
import React from "react";
import { Modal, Stack, Title, TextInput, Button } from "@mantine/core";

const PromptVariableModal = (props: {
  promptContent: string;
  setMessageInput: (content: string) => void;
  variables: string[];
  opened: boolean;
  setOpened: (opened: boolean) => void;
  newMessageInput: string;
}) => {
  const {
    promptContent,
    setMessageInput,
    variables,
    opened,
    setOpened,
    newMessageInput,
  } = props;
  console.log(variables);
  const [values, setValues] = useState<{ [key: string]: string }>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = () => {
    let updatedContent = promptContent;
    for (const variable of variables) {
      const value = values[variable];
      if (value) {
        updatedContent = updatedContent.replace(`{{${variable}}}`, value);
      }
    }
    console.log(promptContent);
    console.log(updatedContent);
    setMessageInput(newMessageInput + updatedContent);
    setOpened(false);
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        setOpened(false);
      }}
      padding={0}
      size={"80%"}
      withCloseButton={false}
    >
      <Stack gap={"md"} p={"lg"} align="center">
        <Title order={3}>Update Prompt Variable</Title>
        <Stack w={"80%"} align="center" gap={"xl"} justify="center">
          {variables.map((variable) => (
            <TextInput
              key={variable}
              label={`${variable}:`}
              withAsterisk
              placeholder={`Enter a value for ${variable}`}
              w={"100%"}
              name={variable}
              onChange={handleChange}
            />
          ))}
          <Button onClick={handleSubmit}>Submit</Button>
        </Stack>
      </Stack>
    </Modal>
  );
};
export default PromptVariableModal;
