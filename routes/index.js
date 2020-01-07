var Memo = require("./memo");
var Account = require("./account");

module.exports = function(app, Memo, Account) {
  // GET ALL MEMOS
  app.get("/api/memosAll", function(req, res) {
    Memo.find(function(err, memos) {
      if (err) return res.status(500).send({ error: "database failure" });
      memos.sort(function(a, b) {
        return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
      });
      res.json(memos);
    });
  });

  // GET ALL MEMOS
  app.get("/api/memos/:account_id", function(req, res) {
    Memo.find({ writer: req.params.account_id }, function(err, memos) {
      if (err) return res.status(500).send({ error: "database failure" });
      memos.sort(function(a, b) {
        return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
      });
      res.json(memos);
    });
  });

  // CREATE MEMO
  app.post("/api/memos", function(req, res) {
    var memo = new Memo();
    memo.key = req.body.key;
    memo.title = req.body.title;
    memo.content = req.body.content;
    memo.writer = req.body.writer;
    memo.color = req.body.color;
    memo.date = req.body.date;

    memo.save(function(err) {
      if (err) {
        console.error(err);
        res.json({ result: 0 });
        return;
      }

      res.json({ result: 1 });
    });
  });

  // Account Msg
  app.post("/api/login", function(req, res) {
    var account = new Account();
    account.id = req.body.id;
    account.password = req.body.password;
    account.createdDate = req.body.createdDate;

    Account.find({ id: account.id }, function(err, accounts) {
      if (err) return res.status(500).send({ error: "database failure" });
      if (accounts.length === 0) {
        // 아이디가 없을 경우 새로 생성
        account.save();
        res.json({ check: 1 });
      } else if (accounts.length > 0) {
        // 아이디가 존재하면 확인해본다.
        Account.find({ id: account.id, password: account.password }, function(
          err,
          accounts
        ) {
          if (accounts.length === 1) {
            // 아이디와 비밀번호가 일치하면 승인
            res.json({ check: 0 });
          } else {
            // 일치하지 않으면 승인하지 않는다.
            res.json({ check: 2 });
          }
        });
      }
    });
  });

  app.post("/api/memos/delete", function(req, res) {
    Memo.deleteOne({ key: req.body.key }, function(err, output) {
      if (err) return res.status(500).json({ error: "database failure" });

      res.json({ result: 1 });
    });
  });

  app.post("/api/memos/update", function(req, res) {
    Memo.updateOne(
      { key: req.body.key },
      {
        $set: {
          title: req.body.title,
          date: req.body.date,
          content: req.body.content
        }
      },
      function(err, output) {
        if (err) res.status(500).json({ error: "database failure" });
        if (!output.n) return res.status(404).json({ error: "memo not found" });
        res.json({ message: "memo updated" });
      }
    );
  });
};
