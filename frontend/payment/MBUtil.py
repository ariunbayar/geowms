from xml.etree.ElementTree import Element, SubElement, tostring
from Crypto.Cipher import DES3, PKCS1_v1_5
import binascii
import datetime
from Crypto.PublicKey import RSA
from django.conf import settings

class MBUtil():


    def __init__(self, amount, description):
        self.amount = amount
        self.description = description
        self.Bank = settings.PAYMENT['BANK']
        self.AccountId = settings.PAYMENT['ACCOUNT_ID']
        self.AccountName = settings.PAYMENT['ACCOUNT_NAME']

        self.account = None
        self.accounts = None

        self.order_id = 1405085651
        self.merch_id = 'merchid12312312'
        self.purchase = 'PURCHASE'
        self.pay_url = settings.PAYMENT['APPROVEURL']
        self.guilgee_utga = 'Guilgeenii utga'
        self.currency = settings.PAYMENT['CURRENCY']

        self.encAccounts = None
        self.encKey = None
        self.encrypts_key = settings.PAYMENT['DES3_ENCRYPTION_KEY']
        self.pemLink = settings.PAYMENT['SIGN_KEY_LOCATION']

        self.finalRequest = None

    def objectToXmlAccount(self):
        root = Element('Account')
        BankXml = SubElement(root, 'Bank')
        BankXml = self.Bank
        AccountIdXml = SubElement(root, 'AccountId')
        AccountIdXml = self.AccountId
        AccountNameXml = SubElement(root, 'AccountName')
        AccountNameXml.text =  self.AccountName
        DescriptionXml = SubElement(root, 'Description')
        DescriptionXml.text = self.description
        AmountXml = SubElement(root, 'Amount')
        AmountXml = self.amount
        self.account = root


    def objectToXmlAccounts(self):
        roots = Element('Accounts')
        roots.extend(self.account)
        self.accounts = roots


    def PaymentVerifyRequestMB(self):
        generated_on = str(datetime.datetime.now())
        root = Element('Request', {'MsgTime': generated_on})
        OrderID = SubElement(root, 'Bank')
        OrderID = self.order_id

        MerchantID = SubElement(root, 'MerchantID')
        MerchantID.text = self.merch_id
        TransactionType = SubElement(root, 'TransactionType')
        TransactionType.text = self.purchase
        Amount = SubElement(root, 'Amount')
        Amount = self.amount

        Currency = SubElement(root, 'Currency')
        Currency = self.currency
        TransactionDateTime = SubElement(root, 'TransactionDateTime')
        TransactionDateTime.text = generated_on
        EncAccounts = SubElement(root, 'EncAccounts')
        EncAccounts.text = self.encAccounts
        EncKey = SubElement(root, 'EncKey')
        EncKey.text = self.encKey
        Description = SubElement(root, 'Description')
        Description.text = self.guilgee_utga 
        ApproveURL = SubElement(root, 'ApproveURL')
        ApproveURL.text = self.pay_url
        DeclineURL = SubElement(root, 'DeclineURL')
        DeclineURL.text = self.pay_url
        CancelURL = SubElement(root, 'CancelURL')
        CancelURL.text = self.pay_url
        self.finalRequest = root


    def bytesToHex(self, array):
        return str(binascii.hexlify(array))


    def encrypts(self, data):
        dataString = tostring(data, encoding='utf-8')
        datas = bytearray(dataString)
        cipher = DES3.new(self.encrypts_key, DES3.MODE_CFB)
        msg = cipher.encrypt(datas)
        return msg


    def signKey(self):
        f = open(self.pemLink, 'rb')
        key = RSA.importKey(f.read())
        cipher = PKCS1_v1_5.new(key)
        encrypted_message = cipher.encrypt(self.encAccounts.encode())

        return encrypted_message


    def xmlConvert(self):
        # Account xml
        self.objectToXmlAccount()
        # Accounts xml
        self.objectToXmlAccounts()
        #encrypt accounts and convert to hex
        encryptedAccounts = self.encrypts(self.accounts)
        self.encAccounts = self.bytesToHex(encryptedAccounts)
        #encrypt Desede key of payment request and convert to hex

        # encryptedKey = self.signKey()
        # self.encKey = self.bytesToHex(encryptedKey)
        self.encKey = self.encAccounts
        #create request xml
        self.PaymentVerifyRequestMB()
        # for i in self.finalRequest:
        #     print(tostring(i))
        
        return self.finalRequest