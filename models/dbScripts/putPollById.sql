UPDATE choices
SET votes = votes + 1
WHERE pollid = $1 AND option = $2;
