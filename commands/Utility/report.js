import { SlashCommandBuilder, ChannelType } from 'discord.js';
import { replyUserError, ErrorTypes } from '../../utils/errorHandler.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

import report from './modules/report.js';
import reportSetchannel from './modules/report_setchannel.js';

export default {
    data: new SlashCommandBuilder()
        .setName('report').setDescription('الإبلاغ عن عضو لإدارة السيرفر، أو تحديد وجهة إرسال البلاغات.')
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('file').setDescription('الإبلاغ عن عضو لفريق إشراف السيرفر.')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('The user you want to report.')
                        .setRequired(true),
                )
                .addStringOption(option =>
                    option
                        .setName('reason')
                        .setDescription('The reason for the report (be detailed).')
                        .setRequired(true)
                        .setMaxLength(500),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setchannel').setDescription('تعيين الروم اللي تُرسل له البلاغات. (يتطلب صلاحية إدارة السيرفر)')
                .addChannelOption(option =>
                    option
                        .setName('channel')
                        .setDescription('The text channel to receive reports.')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true),
                ),
        ),
    category: 'Utility',

    async execute(interaction, config, client) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'file') {
            return await report.execute(interaction, config, client);
        }

        if (subcommand === 'setchannel') {
            return await reportSetchannel.execute(interaction, config, client);
        }

        return await replyUserError(interaction, { type: ErrorTypes.UNKNOWN, message: 'Unknown subcommand.' });
    },
};