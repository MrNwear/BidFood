import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useState } from 'react';
import calendar from '../../assets/cart/calendar.png';
import nextToggleIcon from '../../assets/cart/expand.png';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { connect } from 'react-redux';
import {
  checkoutSetDeliveryTime,
  checkoutSetDeliveryDate,
} from '../../actions';

const Data = [
  // {
  //   time: '8Am - 11Am',
  //   id: 1,
  // },
  // {
  //   time: '11Am - 12Am',
  //   id: 2,
  // },
  // {
  //   time: '12Am - 2Pm',
  //   id: 3,
  // },
  // {
  //   time: '2Pm - 4Pm',
  //   id: 4,
  // },
  // {
  //   time: '4Pm - 6Pm',
  //   id: 5,
  // },
  // {
  //   time: '6Pm - 8Pm',
  //   id: 6,
  // },
  {
    time: '2Pm - 8Pm',
    id: 1,
  },
];

const cityDisabledDays = {
  Dubai: [],
  'Abu Dhabi': [],
  'Al Ain': ['Sunday', 'Tuesday', 'Thursday', 'Saturday'],
  Ajman: ['Sunday', 'Tuesday', 'Thursday', 'Saturday'],
  Sharjah: ['Sunday', 'Monday', 'Wednesday', 'Friday'],
  Fujairah: ['Sunday', 'Monday', 'Tuesday', 'Thursday', 'Saturday'],
  'Ras Al Khaimah': ['Sunday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'],
  'Umm Al Quwain': [
    'Sunday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
};

const getDaysInMonth = (month, year, disabledDays) => {
  let pivot = moment().month(month).year(year).startOf('month');
  const end = moment().month(month).year(year).endOf('month');
  let dates = {};
  const disabled = { disabled: true };
  while (pivot.isBefore(end)) {
    disabledDays.forEach(day => {
      dates[pivot.day(day).format('YYYY-MM-DD')] = disabled;
    });
    pivot.add('days', 1);
  }

  return dates;
};

const TimeToogle = props => {
  const minDate = moment().add(1, 'days').format('YYYY-MM-DD');
  const DISABLED_DAYS = cityDisabledDays[props.selectedStore];
  const [show, setShow] = useState(false);
  const [selectedTime, setSelectedTime] = useState(1);
  const [calendarShow, setCalendarShow] = useState(false);
  const [disabledDays, setDisabledDays] = useState(
    getDaysInMonth(moment().month(), moment().year(), DISABLED_DAYS),
  );
  const [selectedDay, setSelectedDay] = useState();
  console.log('props date time==>', JSON.stringify(DISABLED_DAYS))

  const { checkoutSetDeliveryTime, checkoutSetDeliveryDate, selectedStore } =
    props;

  return (
    <View>
      <View>
        <Text
          style={{
            fontSize: 19,
            color: '#000',
            opacity: 0.9,
            paddingBottom: 10,
          }}>
          {'Expected Date & Time'}
        </Text>
      </View>
      <Text style={{ color: 'red' }}>{props.error == '' ? "" : props.error}</Text>
      <View
        style={{
          width: '97%',
          height: 45,
          backgroundColor: '#F0F1F2',
          borderRadius: 5,
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
        }}>
        <View>
          <TouchableOpacity onPress={() => {
            setCalendarShow(!calendarShow);
            setShow(!show);
            }}>
            <Image source={calendar} style={{ marginLeft: 5 }} />
          </TouchableOpacity>
        </View>
        <Text style={{ paddingLeft: 5, fontWeight: '400' }}>
          {'Select Date & Time'}
        </Text>
        <View
          style={{
            position: 'absolute',
            right: 2,
            alignItems: 'center',
            bottom: 8,
          }}>
          <TouchableOpacity onPress={() => {
            setCalendarShow(!calendarShow);
            setShow(!show);
            }}>
            <Image source={nextToggleIcon} style={{ resizeMode: 'contain' }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Date */}
      <View>
        {calendarShow ? (
          <View>
            <Calendar
              onMonthChange={date => {
                setDisabledDays(
                  getDaysInMonth(date.month - 1, date.year, DISABLED_DAYS),
                );
              }}
              enableSwipeMonths={true}
              theme={{
                monthTextColor: '#8BC63E',
                arrowColor: '#8BC63E',
                textDayFontWeight: '300',
                textSectionTitleColor: '#8BC63E',
              }}
              minDate={minDate}
              markedDates={{ ...selectedDay, ...disabledDays }}
              onDayPress={day => {
                const formattedDate = moment(day.timestamp).format('DD-MM-YY');
                const selectedDate = moment(day.timestamp).format('YYYY-MM-DD');
                props.onPress();
                checkoutSetDeliveryDate({
                  rawDate: day.timestamp,
                  formattedDate,
                });
                setSelectedDay({
                  [selectedDate]: {
                    selected: true,
                    marked: false,
                    selectedColor: '#8BC63E',
                  },
                });
              }}
            />
          </View>
        ) : null}
      </View>

      <View>
        {show ? (
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 8,
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
              width: '97%',
            }}>
            {Data.map(t => (
              <TouchableOpacity
                onPress={() => {
                  checkoutSetDeliveryTime(t);
                  setSelectedTime(t.id);
                }}>
                <View
                  key={t.id}
                  style={{
                    flexDirection: 'row',
                    width: 100,
                    height: 40,
                    marginBottom: 8,
                    marginRight: 10,
                    backgroundColor: selectedTime === t.id ? '#8BC63E' : null,
                    borderColor: selectedTime === t.id ? '#8BC63E' : 'grey',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    borderWidth: 1,
                  }}>
                  <Text
                    key={t.id}
                    style={{ color: selectedTime === t.id ? 'white' : 'grey' }}>
                    {t.time}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
};

const mapStateToProps = ({ checkout, account }) => {
  const { deliveryDate, deliveryTime } = checkout;
  const { store } = account;
  return {
    deliveryDate,
    deliveryTime,
    selectedStore: store.emirates,
  };
};

export default connect(mapStateToProps, {
  checkoutSetDeliveryTime,
  checkoutSetDeliveryDate,
})(TimeToogle);
