import { findExistingExternalIds, bulkInsert } from '../dao/customerDao.js';
import { getCountryMap, getStatusMap } from '../dao/lookupDao.js';
import { chunkArray } from '../utils/chunker.js';
import { report } from '../utils/metrics.js';
import { sequelize } from '../models/index.js';

export const ingestCustomers = async (incomingData, dryRun = false) => {
  const start = Date.now();

 
  const countryMap = await getCountryMap();
  const statusMap = await getStatusMap();


  incomingData.forEach(c => {
    c.country_code = c.country_code.trim().toUpperCase();
    c.status_code = c.status_code.trim().toUpperCase();
  });

  
  const externalIds = incomingData.map(c => c.external_id);
  const existingIds = await findExistingExternalIds(externalIds);
  const existingSet = new Set(existingIds);

  const newRecords = incomingData.filter(c => !existingSet.has(c.external_id));

  const failed = [];
  const toInsert = [];

  for (const record of newRecords) {
    const countryId = countryMap[record.country_code];
    const statusId = statusMap[record.status_code];

    if (!countryId || !statusId) {
      // failed.push(record);
        failed.push({
          record,
          reason: !countryId ? 'Invalid country_code' : 'Invalid status_code'
        });
      continue;
    }


    toInsert.push({
      external_id: record.external_id,
      name: record.name,
      email: record.email,
      country_id: countryId,
      status_id: statusId
    });
  }

  let inserted = 0;
  let preview = [];

  if (dryRun) {
    // Preview mode
    preview = toInsert;
  } else if (toInsert.length > 0) {
    await sequelize.transaction(async (t) => {
      for (const chunk of chunkArray(toInsert, 1000)) {
        const res = await bulkInsert(chunk, t);
        inserted += res.length;
      }
    });
  }

  return {
    received: incomingData.length,
    inserted,
    skipped_existing: existingIds.length,
    failed: failed.length,
    failed_records: failed.length>0?failed : undefined,
    preview: dryRun ? preview : undefined,
    metrics: report(start, incomingData.length)
  };
};