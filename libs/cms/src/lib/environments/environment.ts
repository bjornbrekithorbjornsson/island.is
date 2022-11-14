export default {
  production: false,
  bypassCacheKey: process.env.BYPASS_CACHE_KEY,
  cacheTime: process.env.CACHE_TIME || 300,
  indexableTypes: [
    'article',
    'subArticle',
    'lifeEventPage',
    'articleCategory',
    'news',
    'page',
    'vidspyrnaPage',
    'menu',
    'groupedMenu',
    'organizationPage',
    'organizationSubpage',
    'projectPage',
    'supportQNA',
    'link',
    'frontpage',
    'enhancedAsset',
  ],
  nestedContentTypes: [
    'alertBanner',
    'organizationPage',
    'organization',
    'subArticle',
    'step',
    'stepper',
    'processEntry',
    'embeddedVideo',
    'faqList',
    'sliceConnectedComponent',
    'link',
    'linkUrl',
    'linkList',
    'questionAndAnswer',
    'sectionHeading',
    'sectionWithImage',
    'url',
    'articleGroup',
    'articleSubgroup',
    'articleCategory',
    'menuLink',
    'menuLinkWithChildren',
    'menu',
    'linkGroup',
    'districts',
    'featuredArticles',
    'oneColumnText',
    'twoColumnText',
    'accordionSlice',
    'lifeEventPage',
    'referenceLink',
    'featured',
    'frontpageSlider',
    'namespace',
    'timeline',
    'timelineEvent',
    'form',
    'formField',
    'graphCard',
    'powerBiSlice',
    'emailSignup',
  ],
  contentful: {
    space: process.env.CONTENTFUL_SPACE || '8k0h54kbe6bj',
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || 'test',
    environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    host: process.env.CONTENTFUL_HOST || 'cdn.contentful.com',
  },
  elastic: {
    node: process.env.ELASTIC_NODE || 'http://localhost:9200/',
  },
}
