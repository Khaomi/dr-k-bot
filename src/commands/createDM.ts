import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";
import { MessageFlags } from "discord.js";

@ApplyOptions<Command.Options>({
  description: "Create DM for the specified user",
  preconditions: [["HeadSecurityOnly", "SeniorSecurityOnly", "SecurityOnly", "InternOnly", "BotOwnerOnly"]]
})
export class CreateDMCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder //
          .setName(this.name)
          .setDescription(this.description)
          .addUserOption((option) =>
            option.setName("user").setDescription("User to create description for").setRequired(true)
          ),
      {
        idHints: ["1483610133379416247"]
      }
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const user = interaction.options.getUser("user");

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    await interaction.editReply(
      (await user
        ?.createDM()
        ?.then((x) => x.id)
        .catch(() => undefined)) ?? "Unable to create DM!"
    );
  }
}
