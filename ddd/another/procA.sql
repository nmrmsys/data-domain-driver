/**
 * @name queryA
 * @desc Get data from TBL1
 * @param :FLD1 - Search condition of FLD1
 * @param :FLD2 - Search condition of FLD2
 * @return TBL1 result set
 */
SELECT
  FLD1
 ,FLD2
 ,FLD3
FROM TBL1
WHERE FLD1 = :FLD1
  AND FLD2 = :FLD2