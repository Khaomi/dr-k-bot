import { ModalBuilder, TextInputBuilder, FileUploadBuilder, LabelBuilder, TextInputStyle } from "discord.js";
import { Utility } from "@sapphire/plugin-utilities-store";
import { ApplyOptions } from "@sapphire/decorators";
import config from "../config";

@ApplyOptions<Utility.Options>({
  name: "modal"
})
export class ModalUtility extends Utility {
  public createApplicationModal(): ModalBuilder {
    const modal = new ModalBuilder();

    modal.setCustomId("verification");
    modal.setTitle("Verification");

    config.questions.forEach((question, index) => {
      const input = new TextInputBuilder()
        .setRequired(question.required)
        .setPlaceholder(question.placeholder ?? "")
        .setStyle(question.style)
        .setCustomId(`question-${index + 1}`);

      if (question.value) input.setValue(question.value);

      if (question.minLength) input.setMinLength(question.minLength);

      if (question.maxLength) input.setMaxLength(question.maxLength);

      const label = new LabelBuilder().setLabel(question.label).setTextInputComponent(input);

      modal.addLabelComponents(label);
    });

    return modal;
  }

  public createBanAppealModal(): ModalBuilder {
    const modal = new ModalBuilder();

    modal.setCustomId("ban_appeal");
    modal.setTitle("Ban Appeal");

    config.appealQuestions.forEach((question, index) => {
      const input = new TextInputBuilder()
        .setRequired(question.required)
        .setValue(question.value ?? "")
        .setPlaceholder(question.placeholder ?? "")
        .setStyle(question.style)
        .setCustomId(`question-${index + 1}`);

      if (question.value) input.setValue(question.value);

      if (question.minLength) input.setMinLength(question.minLength);

      if (question.maxLength) input.setMaxLength(question.maxLength);

      const label = new LabelBuilder().setLabel(question.label).setTextInputComponent(input);

      modal.addLabelComponents(label);
    });

    return modal;
  }

  public createMessageModal(channelId?: string, messageId?: string, messageContent?: string): ModalBuilder {
    const modal = new ModalBuilder().setCustomId("messageModal").setTitle("Message to user");

    const channelIdInput = new TextInputBuilder()
      .setCustomId("channelId")
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    if (channelId) channelIdInput.setValue(channelId ?? "");

    const messageIdInput = new TextInputBuilder()
      .setCustomId("messageId")
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    if (messageId) messageIdInput.setValue(messageId);

    const messageContentInput = new TextInputBuilder()
      .setCustomId("messageContent")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

    if (messageContent) channelIdInput.setValue(messageContent ?? "");

    const optionalFileInput = new FileUploadBuilder().setCustomId("optionalFile").setRequired(false);

    const channelIdLabel = new LabelBuilder()
      .setLabel("Channel ID")
      .setDescription("The ID of the channel to message in")
      .setTextInputComponent(channelIdInput);

    const messageIdLabel = new LabelBuilder()
      .setLabel("Message ID (Optional)")
      .setDescription("The ID of the message to message")
      .setTextInputComponent(messageIdInput);

    const messageContentLabel = new LabelBuilder()
      .setLabel("The content of the message to reply")
      .setDescription("The content of the message")
      .setTextInputComponent(messageContentInput);

    const fileInputLabel = new LabelBuilder()
      .setLabel("File to attach")
      .setDescription("If you want to attach any file, put it here")
      .setFileUploadComponent(optionalFileInput);

    modal.addLabelComponents(channelIdLabel, messageIdLabel).addLabelComponents(messageContentLabel, fileInputLabel);

    return modal;
  }
}

declare module "@sapphire/plugin-utilities-store" {
  export interface Utilities {
    modal: ModalUtility;
  }
}
