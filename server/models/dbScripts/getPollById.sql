SELECT P.topic, C.option, C.votes, C.choicesid
FROM poll P
JOIN choices C ON (P.pollid = C.pollid)
WHERE P.pollid = $1;
