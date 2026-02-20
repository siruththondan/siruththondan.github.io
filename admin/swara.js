CMS.registerEditorComponent({
  id: "swara",
  label: "Swara Block",
  fields: [
    { name: 'ragam', label: 'Ragam', widget: 'string' },
    { name: 'thalam', label: 'Thalam', widget: 'string' },
    { name: 'composer', label: 'Composer', widget: 'string' },
    { name: 'notation', label: 'Swara Notation', widget: 'text' }
  ],

  pattern: /\{\{< swara ragam="(.*?)" thalam="(.*?)" composer="(.*?)" >\}\}([\s\S]*?)\{\{< \/swara >\}\}/,

  fromBlock: function(match) {
    return {
      ragam: match[1],
      thalam: match[2],
      composer: match[3],
      notation: match[4]
    };
  },

  toBlock: function(obj) {
    return `{{< swara ragam="${obj.ragam}" thalam="${obj.thalam}" composer="${obj.composer}" >}}
${obj.notation}
{{< /swara >}}`;
  },

  toPreview: function(obj) {
    return `
      <div style="background:#111;padding:10px;border-radius:8px;">
        <strong>🎵 ${obj.ragam}</strong> |
        <strong>🥁 ${obj.thalam}</strong> |
        <strong>✍ ${obj.composer}</strong>
        <pre>${obj.notation}</pre>
      </div>
    `;
  }
});
