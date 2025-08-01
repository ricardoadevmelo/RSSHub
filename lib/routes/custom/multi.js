const { parseDate } = require('@/utils/parse-date');
const { art } = require('@/utils/render');
const got = require('@/utils/got');

module.exports = async (ctx) => {
    const items = [];

    const sources = [
        { url: 'https://www.irishtimes.com/ireland/education/', title: 'Irish Times - Education' },
        { url: 'https://www.irishtimes.com/podcasts/in-the-news/', title: 'Irish Times - Podcasts' },
        { url: 'https://www.rte.ie/', title: 'RTE - Front Page' },
        { url: 'https://www.timeshighereducation.com/', title: 'THE - Front Page' },
        { url: 'https://www.timeshighereducation.com/student', title: 'THE - Students' },
    ];

    for (const source of sources) {
        try {
            const res = await got(source.url);
            const html = res.data;
            const matches = [...html.matchAll(/<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/g)];
            
            for (const match of matches.slice(0, 3)) {
                const link = match[1].startsWith('http') ? match[1] : new URL(match[1], source.url).href;
                const title = match[2].replace(/<[^>]*>/g, '').trim();

                items.push({
                    title: `[${source.title}] ${title}`,
                    link,
                    pubDate: parseDate(new Date()),
                    description: `Resumo automático de ${title}`,
                });
            }
        } catch (err) {
            console.error(`Erro ao buscar ${source.url}:`, err.message);
        }
    }

    ctx.state.data = {
        title: 'Ireland EdNews - Multi Source Feed',
        link: 'https://rsshub-2z8l.onrender.com/custom/multi',
        description: 'Feed combinado de fontes irlandesas de educação',
        item: items,
    };
};
