package pwm_profile

import (
	"encoding/json"
	"math/rand"
	"time"
)

type random struct {
	temporal
	previous float64
}

const coeff = 0.1

func Random(conf json.RawMessage, min, max float64) (*random, error) {
	t, err := Temporal(conf, min, max)
	if err != nil {
		return nil, err
	}
	s := random{
		temporal: t,
		previous: rand.Float64() * t.ValueRange(),
	}
	return &s, nil
}

func (s *random) Get(t time.Time) float64 {
	start := time.Date(t.Year(), t.Month(), t.Day(), s.start.Hour(), s.start.Minute(), s.start.Second(), 0, t.Location())
	end := time.Date(t.Year(), t.Month(), t.Day(), s.end.Hour(), s.end.Minute(), s.end.Second(), 0, t.Location())
	if end.Before(start) {
		end = end.Add(time.Hour * 24)
		if t.Before(start) {
			t = t.Add(time.Hour * 24)
		}
	}
	if t.Before(start) {
		return 0
	}
	if t.After(end) {
		return 0
	}
	f := rand.Float64() * coeff
	if f > (coeff / 2) {
		f = -f
	}
	s.previous += f
	return s.previous
}
