async headers() {
  return [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Cache-Control",
          value: "no-cache"
        },
      ],
    },
  ];
}, 