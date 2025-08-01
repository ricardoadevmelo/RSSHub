const got = require('@/utils/got');
const cheerio = require('cheerio');
const { art } = require('@/utils/render');

module.exports = async (ctx) => {
    const routes = [
        {
            title: 'RTE Front Page',
            url: 'https://www.rte.ie/',
            selector: '.hp-featured__item',
            baseUrl: 'https://www.rte.ie',
        },
        {
            title: 'Irish Times Front Page',
            url: 'https://www.irishtimes.com/',
            selector: 'a[data-testid="Link"]',
            baseUrl: 'https://www.irishtimes.com',
        },
        {
            title: 'Irish Times – In The News',
            url: 'https://www.irishtimes.com/podcasts/in-the-news/',
            selector: 'a[data-testid="Link"]',
            baseUrl: 'https://www.irishtimes.com',
        },
        {
            title: 'Irish Times – Educação',
            url: 'https://www.irishtimes.com/ireland/education/',
            selector: 'a[data-testid="Link"]',
            baseUrl: 'https://www.irishtimes.com',
        },
        {
            title: 'Times Higher Education',
            url: 'https://www.timeshighereducation.com/',
            selector: '.node-title a',
            baseUrl: 'https://www.timeshighereducation.com',
        },
        {
            title: 'THE Student Section',
            url: 'https://www.timeshighereducation.com/student',
            selector: '.node-title a',
            baseUrl: 'https://www.timeshighereducation.com',
        },
    ];

    const items = [];

    for (const route of routes) {
        try {
            const response = await got(route.url);
            const $ = cheerio.load(response.data);

            $(route.selector).each((_, el) => {
                const title = $(el).text().trim();
                const link = $(el).attr('href');

                if (title && link && !link.startsWith('#')) {
                    const fullLink = link.startsWith('http') ? link : `${route.baseUrl}${link}`;
                    const humanizedTitle = `🌍 ${title} (resumo recriado)`;
                    items.push({
                        title: humanizedTitle,
                        description: `Conteúdo recriado automaticamente com IA.`,
                        link: fullLink,
                    });
                }
            });
        } catch (err) {
            console.error(`Erro ao processar ${route.url}:`, err.message);
        }
    }

    ctx.state.data = {
        title: 'Feed Personalizado – Irish Edu',
        link: 'https://meu-rsshub.onrender.com/custom/multi',
        item: items.slice(0, 20),
    };
};
