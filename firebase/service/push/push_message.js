const pushMessage = onRequest(async (req, res) => {
  try {
    const response = await axios.post('https://app.nativenotify.com/api/notification', {
      appId: 30818,
      appToken: "ZmwQ5lOc1tV4oM9jyMuU9J",
      title: "Push title here as a string",
      body: "Push message here as a string",
      dateSent: "6-22-2025 1:57AM",
      pushData: { yourProperty: "yourPropertyValue" }
    });

    res.status(200).send("✅ 推播已送出：" + JSON.stringify(response.data));
  } catch (err) {
    console.error("❌ 發送失敗：", err.response?.data || err.message);
    res.status(500).send("❌ 推播失敗");
  }
});

module.exports = pushMessage;