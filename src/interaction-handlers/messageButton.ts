import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { type ButtonInteraction } from "discord.js";

@ApplyOptions<InteractionHandler.Options>({
  interactionHandlerType: InteractionHandlerTypes.Button
})
export class MessageButtonHandler extends InteractionHandler {
  public async run(interaction: ButtonInteraction) {
    if (
      !interaction.inCachedGuild() ||
      (!this.container.utilities.guild.isHeadSecurity(interaction.member) &&
        !this.container.utilities.guild.isSeniorSecurity(interaction.member) &&
        !this.container.utilities.guild.isSecurity(interaction.member) &&
        !this.container.utilities.guild.isIntern(interaction.member))
    )
      return;

    const [userId, messageId] = interaction.customId.replace("message_", "").split("_");
    const user = await this.container.client.users.fetch(userId).catch(() => undefined);
    let channel = user ? await user.createDM() : interaction.channel;

    const modal = this.container.utilities.modal.createMessageModal(channel?.id, messageId);
    await interaction.showModal(modal);
  }

  public parse(interaction: ButtonInteraction) {
    if (!interaction.customId.startsWith("message")) return this.none();
    return this.some();
  }
}
