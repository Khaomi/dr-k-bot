import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import { MessageFlags, ModalSubmitInteraction } from "discord.js";
import { ApplyOptions } from "@sapphire/decorators";

@ApplyOptions<InteractionHandler.Options>({
  interactionHandlerType: InteractionHandlerTypes.ModalSubmit
})
export class MessageModalHandler extends InteractionHandler {
  public async run(interaction: ModalSubmitInteraction) {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral
    });

    if (
      !interaction.inCachedGuild() ||
      (!this.container.utilities.guild.isHeadSecurity(interaction.member) &&
        !this.container.utilities.guild.isSeniorSecurity(interaction.member) &&
        !this.container.utilities.guild.isSecurity(interaction.member) &&
        !this.container.utilities.guild.isIntern(interaction.member))
    )
      return;

    const channelId = interaction.fields.getTextInputValue("channelId");
    const messageId = interaction.fields.getTextInputValue("messageId");
    const messageContent = interaction.fields.getTextInputValue("messageContent");
    const optionalFile = interaction.fields.getUploadedFiles("optionalFile");

    if (!channelId) return interaction.editReply("Please supply channelId!");

    if (!messageContent && optionalFile?.size === 0)
      return interaction.editReply("Either a message or file is needed!");

    const channel = await this.container.client.channels.fetch(channelId);
    if (!channel || !channel.isSendable()) return interaction.editReply("Can't find that channel!");

    const message = messageId ? await channel.messages.fetch(messageId).catch(() => undefined) : undefined;

    if (message)
      message
        ?.reply({
          content: messageContent,
          files: Array.from(optionalFile?.values() ?? [])
        })
        .then(() => interaction.editReply("Reply sent!"))
        .catch((err) => {
          interaction.editReply("Unable to send message!");
          this.container.logger.error(err);
        });
    else
      channel
        .send({
          content: messageContent,
          files: Array.from(optionalFile?.values() ?? [])
        })
        .then(() => interaction.editReply("Message sent!"))
        .catch((err) => {
          interaction.editReply("Unable to send message");
          this.container.logger.error(err);
        });

    if (interaction.message && interaction.message.embeds.length > 0)
      interaction.message.edit({
        embeds: [
          {
            ...interaction.message.embeds[0]!.data,
            footer: {
              text: `Last reply by ${interaction.user.username}`,
              icon_url:
                interaction.user.avatarURL({
                  size: 4096
                }) ?? interaction.user.defaultAvatarURL
            }
          }
        ]
      });

    try {
      if (message)
        await interaction.message?.reply({
          files: Array.from(optionalFile?.values() ?? []),
          embeds: [
            {
              author: {
                name: interaction.user.username,
                icon_url:
                  interaction.user.avatarURL({
                    size: 4096
                  }) ?? interaction.user.defaultAvatarURL
              },
              description: messageContent || "(No content)",
              footer: {
                text: `Replied to ${message.author.username}`,
                icon_url:
                  message.author.avatarURL({
                    size: 4096
                  }) ?? message.author.defaultAvatarURL
              },
              color: 5793266,
              timestamp: new Date().toISOString()
            }
          ]
        });
    } catch (e) {
      this.container.logger.error(e);
    }
  }

  public parse(interaction: ModalSubmitInteraction) {
    if (interaction.customId !== "messageModal") return this.none();
    return this.some();
  }
}
