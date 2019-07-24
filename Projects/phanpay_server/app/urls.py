from django.contrib import admin
from django.urls import path, re_path
from app.Services.User import sign_up, sign_in, initial_info
from app.Services.Payments import transfer_funds
from app.Services.Account import withdrawal, deposit
from app.Services.Reports.User import transaction_history_user, deposit_history, withdrawal_history, today_history
from app.Services.Reports.Admin import fees_history, depos_withdraw_date, transaction_report, fees_per_date

urlpatterns = [
    path('admin/', admin.site.urls),
    #
    path('api/sign-up/', sign_up.registration),
    path('api/sign-in/', sign_in.login),
    path('api/transfer-funds/<int:acc_id>/', transfer_funds.transfer_funds),
    path('api/withdrawal-funds/<int:acc_id>/', withdrawal.make_withdrawal),
    path('api/deposit-funds/<int:acc_id>/', deposit.make_deposit),
    #
    path('api/initial-info/<int:acc_id>', initial_info.get_initial_info),
    path('api/transaction-history/<int:acc_id>/', transaction_history_user.get_transaction_history),
    path('api/deposit-history/<int:acc_id>/', deposit_history.get_deposit_history),
    path('api/withdrawal-history/<int:acc_id>/', withdrawal_history.get_withdrawal_history),
    path('api/fees-history/', fees_history.get_fees_history),
    path('api/current-history/<int:acc_id>/', today_history.current_payment_history),
    re_path(r'^api/report-date/withdrawals/(?P<from_date>[0-9]{4}-[0-9]{2}-[0-9]{2})/(?P<to_date>[0-9]{4}-[0-9]{2}-[0-9]{2})/$', depos_withdraw_date.get_withdrawals_per_date),
    re_path(r'^api/report-date/deposits/(?P<from_date>[0-9]{4}-[0-9]{2}-[0-9]{2})/(?P<to_date>[0-9]{4}-[0-9]{2}-[0-9]{2})/$', depos_withdraw_date.get_deposits_per_date),
    re_path(r'^api/transaction-date/(?P<from_date>[0-9]{4}-[0-9]{2}-[0-9]{2})/(?P<to_date>[0-9]{4}-[0-9]{2}-[0-9]{2})/$', transaction_report.get_transaction_report),
    re_path(r'^api/fees-date/(?P<from_date>[0-9]{4}-[0-9]{2}-[0-9]{2})/(?P<to_date>[0-9]{4}-[0-9]{2}-[0-9]{2})/$', fees_per_date.get_fees_per_date),
]
