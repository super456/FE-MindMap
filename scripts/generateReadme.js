import fs from 'fs-extra'
import { execa } from 'execa'
import { globbySync } from 'globby'
import { orderBy } from 'lodash-es'

const MD_HEADER = `# 前端知识图谱

纵倾童鞋的前端知识学习图谱，根据前端领域学习过程总结，用思维导图的方式总结个人所学知识和整个技能体系，方便梳理知识点、结构化输出、总结核心技术点等，期待您的关注⭐️（持续更新中🚀...）

*说明：感谢[茂茂的知识图谱模版](https://github.com/maomao1996/FE-MindMap)，本知识图谱仅供学习参考，请勿用于商业用途。*

## 思维导图目录
`
const MD_FOOTER = `\n`

const MD_FOOTER_REMARK = `
## 使用
1. 先安装 \`pnpm\`

\`\`\`sh
npm i -g pnpm
\`\`\`

2. 安装依赖
\`\`\`sh
pnpm install
\`\`\`

3. 生成 XMind 文件

**注意：** 请将在 \`xmind\` 文件夹下放置 \`.xmind\` 文件

\`\`\`sh
pnpm gxmind
\`\`\`

4. 生成 README 文件

**注意：** 将会自动生成 \`README.md\` 文件覆盖根目录 \`README.md\` 文件

\`\`\`sh
pnpm greadme
\`\`\`

5. 开发启动
\`\`\`sh
pnpm dev
\`\`\`

6. 构建
\`\`\`sh
pnpm build
\`\`\`


7. 预览
\`\`\`sh
pnpm preview
\`\`\`

## 友情链接
1. [茂茂的前端知识图谱](https://github.com/maomao1996/FE-MindMap)

- [x] [CSS 知识总结 <img alt="" height="16" src="https://img.shields.io/github/size/maomao1996/FE-MindMap/xmind/CSS%20%E7%9F%A5%E8%AF%86%E6%80%BB%E7%BB%93.xmind" align="center" />](https://github.com/maomao1996/FE-MindMap/blob/main/xmind/CSS%20%E7%9F%A5%E8%AF%86%E6%80%BB%E7%BB%93.xmind)

- [x] [Webpack <img alt="" height="16" src="https://img.shields.io/github/size/maomao1996/FE-MindMap/xmind/Webpack.xmind" align="center" />](https://github.com/maomao1996/FE-MindMap/blob/main/xmind/Webpack.xmind)

- [x] [ES6 知识总结 <img alt="" height="16" src="https://img.shields.io/github/size/maomao1996/FE-MindMap/xmind/ES6%20%E7%9F%A5%E8%AF%86%E6%80%BB%E7%BB%93.xmind" align="center" />](https://github.com/maomao1996/FE-MindMap/blob/main/xmind/ES6%20%E7%9F%A5%E8%AF%86%E6%80%BB%E7%BB%93.xmind)

- [x] [前端性能优化 — 拉钩 <img alt="" height="16" src="https://img.shields.io/github/size/maomao1996/FE-MindMap/xmind/%E5%89%8D%E7%AB%AF%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%20%E2%80%94%20%E6%8B%89%E9%92%A9.xmind" align="center" />](https://github.com/maomao1996/FE-MindMap/blob/main/xmind/%E5%89%8D%E7%AB%AF%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%20%E2%80%94%20%E6%8B%89%E9%92%A9.xmind)

- [x] [浏览器缓存 <img alt="" height="16" src="https://img.shields.io/github/size/maomao1996/FE-MindMap/xmind/%E6%B5%8F%E8%A7%88%E5%99%A8%E7%BC%93%E5%AD%98.xmind" align="center" />](https://github.com/maomao1996/FE-MindMap/blob/main/xmind/%E6%B5%8F%E8%A7%88%E5%99%A8%E7%BC%93%E5%AD%98.xmind)

2. 预览地址：
- <https://xmind.fe-mm.com>
- <https://xmind.netlify.app>
- <https://femindmap.vercel.app>
- <https://fe-xmind.vercel.app>
`

function getXmindList(directory = '') {
  return globbySync(`${directory}/**/*.(xmind)`, {
    objectMode: true
  }).map(({ name, path }) =>
    execa('git', ['log', '--pretty=format:%ad', '--date=short', path]).then((res) => {
      const time = res.stdout.split('\n')
      return {
        name: name.replace('.xmind', ''),
        path,
        updateTime: time.at(0),
        createdTime: time.at(-1)
      }
    })
  )
}

function generateList(list) {
  if (!list.length) {
    return ''
  }

  return orderBy(
    list.filter((item) => item.updateTime),
    ['updateTime'],
    ['desc']
  )
    .map(
      (item) =>
        `- [x] [${
          item.name
        } <img alt="" height="16" src="https://img.shields.io/github/size/super456/FE-MindMap/${encodeURI(
          item.path
        )}" align="center" />](/${encodeURI(item.path)})
  - 创建时间: ${item.createdTime}
  - 更新时间: ${item.updateTime}`
    )
    .join('\n')
}

try {
  // 组装 MD 头部
  let md = MD_HEADER

  // 组装列表数据
  const result = await Promise.all(getXmindList('xmind'))
  md += generateList(result)

  // 组装 MD 尾部
  md += MD_FOOTER

  // 组装 MD 尾部备注
  md += MD_FOOTER_REMARK

  // 写入 README.md 文件
  fs.writeFile('README.md', md, 'utf8')
    .then(() => {
      console.log('README.md 文件创建成功')
    })
    .catch(() => {
      console.log('README.md 文件创建失败')
    })
} catch (error) {
  console.log('生成 README MD 文件报错：>> ', error)
}
