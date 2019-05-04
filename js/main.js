const NewsLoader = {
    /**
     * @author Evgenii Rogozhuk
     * @description Ajax news loader from newsapi.org
     *
     * @property {object} settings Settings for feed
     * @property {int} settings.count count news on page
     * @property {int} settings.moreCount how many items call when click more button
     * @property {int} settings.totalLength This will take total items when connect to news API
     */

    settings: {
        count: 10,
        moreCount: 10,
        totalLength: 0,
    },

    /**
     * @function
     * @name ajaxLoad
     * @description AJAX connect to API news feed and load more items
     * @param {int} items count
     */
    ajaxLoad(items) {
        $.ajax({
            url: `https://newsapi.org/v2/top-headlines?country=ru&category=technology&pageSize=${items}
            &apiKey=a2ee88b63f1e4424b779520685cc6c3c`,
            type: "GET",
            dataType: "json",
            beforeSend: () => {
                $('#loader').addClass('loader');
                $('#button').addClass('hidden');
            },
            success: data => {
                this.mapNews(data.articles);
                this.settings.totalLength = data.totalResults;
                $('#loader').removeClass('loader');
                $('#button').removeClass('hidden');
            },
            error: () => $('#news').html('Что-то с подключением или новостей нет'),
        });
    },
    /**
     * @function
     * @name loadMore
     * @description See items count in API, and give to counter more items on click or error to button
     */
    loadMore() {
        if (this.settings.totalLength < this.settings.count) {
            $('#button').html('Больше новостей нет').addClass('disabled');
        } else {
            let itemsCount = this.settings.count;
            this.settings.count = itemsCount + this.settings.moreCount;
            this.ajaxLoad(this.settings.count);
        }
    },

    /**
     * @function
     * @name renderNews
     * @description this render news item to page
     * @param {object} item of news
     */
    renderNews(item) {
        const {description, title, urlToImage, url, publishedAt} = item;
        const date = this.dateNormalize(publishedAt);
        return `<div class="news-item">
                     <a
                        title="${title}"
                        target="_blank"
                        href="${url}"
                     >
                         <img
                            src="${urlToImage}"
                            alt="${title}"
                            class="news-item__image"
                         />
                     </a>
                     <a
                        title="${title}"
                        target="_blank"
                        href="${url}"
                     >
                         <h3 class="news-item__title">
                             ${title}
                         </h3>
                         <p class="news-item__description">
                             ${description}
                         </p>
                         <div class="news-item__date">
                             ${date}
                         </div>
                     </a>
                 </div>`;
    },

    /**
     * @function
     * @name mapNews
     * @description this render map of all news items to renderNews
     * @param {Array} data of all news
     */
    mapNews(data) {
        $('#news').html(data.map(item => this.renderNews(item)).join(''));
    },

    /**
     * @function
     * @name dateNormalize
     * @description normalize catch date from API to normal date
     * @param {string} time news item from API
     */
    dateNormalize(time) {
        const unixTimeStamp = Date.parse(time);
        const date = new Date(unixTimeStamp);

        let day = (date.getDate() < 10 ? '0' : '') + date.getDate();
        let month = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
        let year = date.getFullYear();
        let hours = ((date.getHours() % 12 || 12) < 10 ? '0' : '') + (date.getHours() % 12 || 12);
        let minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();

        return day + '.' + month + '.' + year + ' в ' + hours + ':' + minutes;
    },
};


// start init
$(document).ready(() => NewsLoader.ajaxLoad(NewsLoader.settings.count));