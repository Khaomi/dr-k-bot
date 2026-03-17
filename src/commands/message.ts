import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";

@ApplyOptions<Command.Options>({
  description: "Open the message prompt",
  preconditions: [["HeadSecurityOnly", "SeniorSecurityOnly", "SecurityOnly", "InternOnly", "BotOwnerOnly"]]
})
export class MessageCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder //
          .setName(this.name)
          .setDescription(this.description),
      {
        idHints: ["1472607272298479706"]
      }
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const modal = this.container.utilities.modal.createMessageModal(interaction.channel?.id);
    await interaction.showModal(modal);
  }
}
