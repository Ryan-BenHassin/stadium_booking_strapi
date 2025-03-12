import { addDays, eachDayOfInterval, format, parse, addHours, addMinutes, isWithinInterval } from 'date-fns';

export default {
  async find(ctx) {
    try {
      const { complexId } = ctx.params;

      if (!complexId) {
        return ctx.badRequest('Complex ID is required');
      }

      // Get complex data using documentId
      const complexes = await strapi.db.query('api::complex.complex').findMany({
        where: { documentId: complexId }
      });

      if (!complexes || complexes.length === 0) {
        return ctx.notFound('Complex not found');
      }

      const complex = complexes[0];

      const today = new Date();
      const fourHoursFromNow = addHours(today, 4);
      const twoWeeksLater = addDays(today, 14);

      // Parse complex opening hours
      const openTime = parse(complex.openTime, 'HH:mm:ss.SSS', new Date());
      const closeTime = parse(complex.closeTime, 'HH:mm:ss.SSS', new Date());
      const openHour = openTime.getHours();
      const closeHour = closeTime.getHours() || 24; // If closeTime is 00:00, treat it as 24:00

      // Get existing reservations for this complex
      const existingReservations = await strapi.db.query('api::reservation.reservation').findMany({
        where: {
          complex: complex.id,  // Use the internal ID here
          date: {
            $gte: today,
            $lte: twoWeeksLater
          },
          state: {
            $in: ['PENDING', 'CONFIRMED']
          }
        }
      });

      // Generate available time slots
      const days = eachDayOfInterval({
        start: today,
        end: twoWeeksLater
      });

      const SLOT_DURATION = 90; // 1.5 hours in minutes
      const availableDatetimes = [];

      for (const day of days) {
        // Adjust to check slots at 1.5 hour intervals
        for (let minutes = openHour * 60; minutes < closeHour * 60; minutes += SLOT_DURATION) {
          const datetime = addMinutes(day, minutes);
          
          // Skip if datetime is less than 4 hours from now
          if (datetime <= fourHoursFromNow) {
            continue;
          }

          // Check if the datetime slot overlaps with any existing reservation
          const isBooked = existingReservations.some(reservation => {
            const reservationStart = new Date(reservation.date);
            const reservationEnd = addMinutes(reservationStart, SLOT_DURATION);
            const slotStart = datetime;
            const slotEnd = addMinutes(datetime, SLOT_DURATION);
            
            // Two time ranges overlap if one starts before the other ends
            return slotStart < reservationEnd && reservationStart < slotEnd;
          });

          if (!isBooked) {
            availableDatetimes.push(format(datetime, "yyyy-MM-dd'T'HH:mm:ssXXX"));
          }
        }
      }

      return { data: availableDatetimes };

    } catch (error) {
      ctx.throw(500, error);
    }
  }
};
