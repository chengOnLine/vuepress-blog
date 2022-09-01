module.exports = {
    title: 'VuePress Blog Example', // Title for the site. This will be displayed in the navbar.
    theme: '@vuepress/theme-blog',
    themeConfig: {
        // Please keep looking down to see the available options.
        footer:{
            contact: [
                {
                    type: "github",
                    link: "https://github.com/"
                },
                {
                    type: "phone",
                    link: "15119623093",
                },
                {
                    type: "mail",
                    link: "101903471@qq.com",
                }
            ]
        },
    },
    plugins: [
        [
          '@vuepress/blog',
          {
            directories: [
              {
                // Unique ID of current classification
                id: 'post',
                // Target directory
                dirname: 'post',
                // Path of the `entry page` (or `list page`)
                path: '/',
                title: '随笔',
                frontmatter:{
                    tag: 'vuepress'
                },
                itemLayout: 'Writing', // Layout for matched pages.
                itemPermalink: '/writings/:year/:month/:day/:slug', // Permalink for matched pages.
                pagination: { // Pagination behavior
                  lengthPerPage: 2,
                },
              },
            ],
            frontmatters: [
                {
                  // Unique ID of current classification
                  id: 'tag',
                  // Decide that the frontmatter keys will be grouped under this classification
                  keys: ['tag' , 'tags'],
                  // Path of the `entry page` (or `list page`)
                  path: '/tag/',
                  // Layout of the `entry page`
                  layout: 'Tags',
                  // Layout of the `scope page`
                  scopeLayout: 'Tag'
                },
            ],
            globalPagination: {
                prevText:'上一页', // Text for previous links.
                nextText:'下一页', // Text for next links.
                lengthPerPage:'2', // Maximum number of posts per page.
                layout:'Pagination', // Layout for pagination page
            }
          },
        ],
        [
            '@vssue/vuepress-plugin-vssue',
            {
              // set `platform` rather than `api`
              platform: 'github',
        
              // all other options of Vssue are allowed
              owner: 'chengOnLine',
              repo: 'blog',
              clientId: '3d43232f1dccf56e99d9',
              clientSecret: 'e7e6c0dcbba613d8ee04917394e4f5486c729a2f',
            },
          ]
    ],
}