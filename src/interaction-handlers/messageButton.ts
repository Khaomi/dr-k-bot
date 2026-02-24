import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import {
  FileUploadBuilder,
  LabelBuilder,
  ModalBuilder,
  TextDisplayBuilder,
  TextInputBuilder,
  TextInputStyle,
  type ButtonInteraction
} from "discord.js";

@ApplyOptions<InteractionHandler.Options>({
  interactionHandlerType: InteractionHandlerTypes.Button
})
export class Handler extends InteractionHandler {
  public async run(interaction: ButtonInteraction) {
    if (
      !interaction.inCachedGuild() ||
      (!this.container.utilities.guild.isHeadSecurity(interaction.member) &&
        !this.container.utilities.guild.isSeniorSecurity(interaction.member) &&
        !this.container.utilities.guild.isSecurity(interaction.member) &&
        !this.container.utilities.guild.isIntern(interaction.member))
    )
      return;

    await interaction.deferReply();

    const [userId, messageId] = interaction.customId.replace("message_", "").split("_");

    const modal = new ModalBuilder().setCustomId("messageModal").setTitle("Message to user");

    const userIdInput = new TextInputBuilder().setCustomId("userId").setStyle(TextInputStyle.Short).setRequired(true);

    if (userId) userIdInput.setValue(userId);

    const messageIdInput = new TextInputBuilder()
      .setCustomId("messageId")
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    if (messageId) messageIdInput.setValue(messageId);

    const messageContentInput = new TextInputBuilder()
      .setCustomId("messageContent")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

    const optionalFileInput = new FileUploadBuilder().setCustomId("optionalFile").setRequired(false);

    const userIdLabel = new LabelBuilder()
      .setLabel("User ID")
      .setDescription("The ID of the user to message")
      .setTextInputComponent(userIdInput);

    const messageIdLabel = new LabelBuilder()
      .setLabel("Message ID (Optional)")
      .setDescription("If provided, will try to reply to that message")
      .setTextInputComponent(messageIdInput);

    const messageReplyLabel = new TextDisplayBuilder().setContent("Choose one or both of the below");

    const messageContentLabel = new LabelBuilder()
      .setLabel("The content of the message")
      .setTextInputComponent(messageContentInput);

    const fileInputLabel = new LabelBuilder()
      .setLabel("File to attach")
      .setDescription("File that you gonna attach to the message")
      .setFileUploadComponent(optionalFileInput);

    modal
      .addLabelComponents(userIdLabel, messageIdLabel)
      .addTextDisplayComponents(messageReplyLabel)
      .addLabelComponents(messageContentLabel, fileInputLabel);

    await interaction.showModal(modal);
  }

  public parse(interaction: ButtonInteraction) {
    if (!interaction.customId.startsWith("message")) return this.none();
    return this.some();
  }
}
