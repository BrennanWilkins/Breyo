export const COLORS = ['#f05544', '#f09000', '#489a3c', '#0079bf', '#7150df', '#38bbf4', '#ad5093', '#4a32dd', '#046b8b'];

export const LABEL_COLORS = ['#60C44D', '#F5DD2A', '#FF8C00', '#F60000', '#1086C9', '#6349BD', '#65CAF6', '#DA57A8', '#39DAAE', '#0E1137'];

export const PHOTO_IDS = ['1607556049122-5e3874a25a1f', '1605325811474-ba58cf3180d8', '1513580638-fda5563960d6',
'1554129352-f8c3ab6d5595', '1596709097416-6d4206796022', '1587732282555-321fddb19dc0', '1605580556856-db8fae94b658',
'1605738862138-6704bedb5202', '1605447781678-2a5baca0e07b'];

// photos from above that have a light background
export const LIGHT_PHOTO_IDS = [PHOTO_IDS[0], PHOTO_IDS[2], PHOTO_IDS[4], PHOTO_IDS[8]];

export const getPhotoURL = (photoID, width) => (
  `url("https://images.unsplash.com/photo-${photoID}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxOTAwODJ8MHwxfGFsbHx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=${width}")`
);
