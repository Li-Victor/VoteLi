SELECT C.option
FROM poll P
JOIN choices C ON (P.pollid = C.pollid)
WHERE P.pollid = $1;
