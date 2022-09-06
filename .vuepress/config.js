module.exports = {
    title: '适合一个人躲藏的角落', // Title for the site. This will be displayed in the navbar.
    theme: '@vuepress/theme-blog',
    themeConfig: {
      repo: 'chengOnLine/vuepress-blog',
      // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
      // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
      repoLabel: '查看源码',
      editLinks: true,
      // 默认为 "Edit this page"
      // editLinkText: '帮助我们改善此页面！',
      lastUpdated: '上次更新时间', // string | boolean

      nav:[
        {
          text: "首页",
          link: "/",
        },
        {
          text: "文章",
          link: "/post/",
        },
        {
          text: "标签",
          link: "/tag/", 
        }
      ],
      // sidebar:[
      //   {
      //     title: "首页",
      //     path: "/",
      //   },{
      //     title: "group1",
      //     path: "/post/intro-javascript",
      //     collapsable: false,
      //     children:[
      //       // '/post/intro-javascript',
      //       // '/post/intro-markdown',
      //       ['/post/intro-javascript' , 'JavaScript' ],
      //       ['/post/intro-markdown' , 'Markdonw' ],
      //     ] 
      //   },{
      //     title:"group2",
      //     children:[
      //       '/post/intro-vuepress',
      //       // ["intro-vuepress" , 'Vuepress' ],
      //     ]
      //   }
      // ],

      sidebar: {
        '/post/': [
          "",
          "intro-javascript",
          "intro-markdown",
          "intro-vuepress"
        ]
      },
      // displayAllHeaders: true, // 默认值：false
        // Please keep looking down to see the available options.
      footer:{
          contact: [
              {
                  type: "github",
                  link: "https://github.com/chengOnLine/vuepress-blog"
              },
              {
                  type: "phone",
                  link: "15119623093",
              },
              {
                  type: "mail",
                  link: "101903471@qq.com",
              }
          ],
          copyright: [
            {
              text: 'Privacy Policy',
              link: 'https://policies.google.com/privacy?hl=en-US',
            },
            {
              text: 'MIT Licensed | Copyright © 2018-present Vue.js',
            },
          ],
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
                path: '/post/',
                title: '随笔',
                frontmatter:{
                    tag: 'vuepress'
                },
                itemLayout: 'Writing', // Layout for matched pages.
                itemPermalink: '/post/:year/:month/:day/:slug', // Permalink for matched pages.
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
        // [
        //   '@vuepress/register-components'
        // ],
        // [
        //     '@vssue/vuepress-plugin-vssue',
        //     {
        //       // set `platform` rather than `api`
        //       platform: 'github',
        
        //       // all other options of Vssue are allowed
        //       owner: 'chengOnLine',
        //       repo: 'vuepress-blog',
        //       clientId: '3d43232f1dccf56e99d9',
        //       clientSecret: 'e7e6c0dcbba613d8ee04917394e4f5486c729a2f',
        //     },
        // ],
        // [
        //   'vuepress-plugin-comment',
        //   {
        //     choosen: 'valine', 
        //     options: {
        //       el: '#valine-vuepress-comment',
        //       appId: 'hcLxE7L0jK9GgZ1s6pHeJKNA-gzGzoHsz',
        //       appKey: 'GtYqfvOp8HzPnhaXHENZEo25'
        //     }
        //   }
        // ]
    ],
}