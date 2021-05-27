import { Numbers } from '../Numbers';
import { getEiqOfAchievementsByLot } from '.';

export const getLots = (lots, activitiesWithEiq): Object[] => {
  return lots.map(
    ({ provinceName, _id: lotId, cityName, countryName, surface, image }) => {
      const { normal: path } = image || {};
      const imageLot = path
        ? `https://ucropsatelliteimagery.s3.amazonaws.com/stage/Image.svg`
        : null;
      const eiq: number = getEiqOfAchievementsByLot(lotId, activitiesWithEiq);
      return {
        provinceName,
        cityName,
        countryName,
        surface,
        eiq: Numbers.roundToTwo(eiq),
        image: imageLot,
      };
    }
  );
};
