import { type GuildMember, EmbedBuilder } from "discord.js";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { ApplyOptions } from "@sapphire/decorators";
import config from "../config";

const memberOption = (option: any, description = "-") =>
  option.setName("member").setDescription(description).setRequired(true);

@ApplyOptions<Subcommand.Options>({
  description: "Send a message in the member's dm",
  preconditions: [
    "ChangedGuildOnly",
    ["HeadSecurityOnly", "SeniorSecurityOnly", "SecurityOnly", "InternOnly", "BotOwnerOnly"]
  ],
  subcommands: [
    { name: "nsfw", chatInputRun: "nsfwCommand" },
    { name: "warn", chatInputRun: "warnCommand" },
    { name: "custom", chatInputRun: "customCommand" }
  ]
})
export class DMCommand extends Subcommand {
  public override registerApplicationCommands(registry: Subcommand.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        (builder as any)
          .setName(this.name)
          .setDescription(this.description)
          .addSubcommand((builder: any) =>
            builder.setName("nsfw").setDescription("Warn the member for NSFW").addUserOption(memberOption)
          )
          .addSubcommand((builder: any) =>
            builder
              .setName("warn")
              .setDescription("Warn the member in DM")
              .addUserOption(memberOption)
              .addStringOption((option: any) =>
                option.setName("reason").setDescription("The reason for the warning").setRequired(true)
              )
          )
          .addSubcommand((builder: any) =>
            builder
              .setName("custom")
              .setDescription("Send custom text in member's DM")
              .addUserOption(memberOption)
              .addStringOption((option: any) =>
                option.setName("message").setDescription("The message to send").setRequired(true)
              )
          ),
      {
        idHints: ["1425880752813510779"],
        guildIds: [config.guildId]
      }
    );
  }

  public async nsfwCommand(interaction: Subcommand.ChatInputCommandInteraction) {
    const member = interaction.options.getMember("member")! as GuildMember;
    const modal = this.container.utilities.modal.createMessageModal(
      (await member.createDM()).id,
      undefined,
      `${interaction.user} has deemed your pfp or banner to be against our NSFW policy, you have 10 minutes to change it or to contact ${interaction.user} to resolve the issue.`
    );
    interaction.showModal(modal);
  }

  public async warnCommand(interaction: Subcommand.ChatInputCommandInteraction) {
    const member = interaction.options.getMember("member")! as GuildMember;
    const reason = interaction.options.getString("reason", true);

    const modal = this.container.utilities.modal.createMessageModal(
      (await member.createDM()).id,
      undefined,
      `${interaction.user} has warned you for "${reason}". Contact them if you have questions or concerns regarding the warn`
    );
    interaction.showModal(modal);
  }

  public async customCommand(interaction: Subcommand.ChatInputCommandInteraction) {
    const member = interaction.options.getMember("member")! as GuildMember;
    const message = interaction.options.getString("message", true);

    const modal = this.container.utilities.modal.createMessageModal((await member.createDM()).id, undefined, message);
    interaction.showModal(modal);
  }
}
