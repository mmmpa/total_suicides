require 'rails_helper'

describe Tagged do
  describe 'year' do
    it { expect(Total.in(21).first.number).to eq(9306) }
    it { expect(Age.in(21).first.o0).to eq(205) }
    it { expect(Housemate.in(21).first.yes).to eq(7247) }
    it { expect(Job.in(21).first.self_employed).to eq(326) }
    it { expect(Location.in(21).first.home).to eq(5823) }
    it { expect(Way.in(21).first.hanging).to eq(4947) }
    it { expect(Hour.in(21).first.a0).to eq(733) }
    it { expect(Day.in(21).first.sunday).to eq(1250) }
    it { expect(Reason.in(21).first.family).to eq(1418) }
    it { expect(Attempted.in(21).first.yes).to eq(2752) }
  end

  describe 'area' do
    it { expect(Total.in(21).at(1).first.number).to eq(468) }
    it { expect(Age.in(21).at(1).first.o0).to eq(15) }
    it { expect(Housemate.in(21).at(1).first.yes).to eq(362) }
    it { expect(Job.in(21).at(1).first.self_employed).to eq(18) }
    it { expect(Location.in(21).at(1).first.home).to eq(317) }
    it { expect(Way.in(21).at(1).first.hanging).to eq(304) }
    it { expect(Hour.in(21).at(1).first.a0).to eq(59) }
    it { expect(Day.in(21).at(1).first.sunday).to eq(59) }
    it { expect(Reason.in(21).at(1).first.family).to eq(73) }
    it { expect(Attempted.in(21).at(1).first.yes).to eq(143) }
  end

  describe 'gender' do
    it { expect(Total.in(21).at(1).by(2).first.number).to eq(1090) }
    it { expect(Age.in(21).at(1).by(2).first.o0).to eq(16) }
    it { expect(Housemate.in(21).at(1).by(2).first.yes).to eq(759) }
    it { expect(Job.in(21).at(1).by(2).first.self_employed).to eq(165) }
    it { expect(Location.in(21).at(1).by(2).first.home).to eq(540) }
    it { expect(Way.in(21).at(1).by(2).first.hanging).to eq(698) }
    it { expect(Hour.in(21).at(1).by(2).first.a0).to eq(124) }
    it { expect(Day.in(21).at(1).by(2).first.sunday).to eq(160) }
    it { expect(Reason.in(21).at(1).by(2).first.family).to eq(133) }
    it { expect(Attempted.in(21).at(1).by(2).first.yes).to eq(143) }
  end
end