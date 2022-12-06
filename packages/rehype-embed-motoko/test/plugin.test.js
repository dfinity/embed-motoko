import rehypeStringify from 'rehype-stringify/lib';
import remarkParse from 'remark-parse/lib';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import rehypeEmbedMotoko from '..';

test('transforms a basic example', async () => {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeEmbedMotoko)
    .use(rehypeStringify).process(`
# Embed Motoko
\`\`\`motoko
module {
  public let x = 123;
}
\`\`\``);
  expect(result.value).toEqual('');
});
