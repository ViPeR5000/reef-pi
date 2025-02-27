import * as Yup from 'yup'
import i18next from 'i18next'

const PhSchema = Yup.object().shape({
  name: Yup.string()
    .required(i18next.t('ph:name_required')),
  enable: Yup.bool()
    .required(i18next.t('ph:status_required')),
  period: Yup.number()
    .required(i18next.t('ph:period_required'))
    .integer()
    .typeError(i18next.t('ph:period_type'))
    .min(1, i18next.t('ph:period_min')),
  notify: Yup.bool(),
  analog_input: Yup.string()
    .required(i18next.t('ph:analog_input_required')),
  minAlert: Yup.number()
    .when('notify', (alert, schema) => {
      if (alert === true || alert === 'true') {
        return schema
          .required(i18next.t('ph:threshold_required'))
          .typeError(i18next.t('ph:threshold_type'))
          .test('lessThan', i18next.t('ph:threshold_less_than'), function (min) {
            return min < this.parent.maxAlert
          })
      } else { return schema }
    }),
  maxAlert: Yup.number()
    .when('notify', (alert, schema) => {
      if (alert === true || alert === 'true') {
        return schema
          .required(i18next.t('ph:threshold_required'))
          .typeError(i18next.t('ph:threshold_type'))
          .test('greaterThan', i18next.t('ph:threshold_greater_than'), function (max) {
            return max > this.parent.minAlert
          })
      } else { return schema }
    })
})

export default PhSchema
