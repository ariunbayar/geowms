from xml.etree.ElementTree import Element, SubElement, tostring
from Crypto.Cipher import DES3, PKCS1_v1_5
import binascii
import datetime
from Crypto.PublicKey import RSA


def objectToXmlAccount(data):
    Bank = data.bank
    AccountId = data.accountId
    AccountName = data.accountName
    Description = data.description
    Amount = data.amount
    root = Element('Account')
    BankXml = SubElement(root, 'Bank')
    BankXml.text = AccountName
    AccountIdXml = SubElement(root, 'AccountId')
    AccountIdXml.text = AccountName
    AccountNameXml = SubElement(root, 'AccountName')
    AccountNameXml.text = AccountName
    DescriptionXml = SubElement(root, 'Description')
    DescriptionXml.text = AccountName
    AmountXml = SubElement(root, 'Amount')
    AmountXml.text = AccountName
    return root


def objectToXmlAccounts(data):
    roots = Element('Accounts')
    roots.extend(data)
    return roots


def PaymentVerifyRequestMB(amount, encAccounts, encKey):
    generated_on = str(datetime.datetime.now())
    root = Element('Request', {'MsgTime':generated_on})
    OrderID = SubElement(root, 'Bank')
    OrderID.text = "1405085651"
    MerchantID = SubElement(root, 'MerchantID')
    MerchantID.text = "MERCH"
    TransactionType = SubElement(root, 'TransactionType')
    TransactionType.text = "PURCHASE"
    Amount = SubElement(root, 'Amount')
    Amount.text = "12500"
    Currency = SubElement(root, 'Currency')
    Currency.text = "496"
    TransactionDateTime = SubElement(root, 'TransactionDateTime')
    TransactionDateTime.text = generated_on
    EncAccounts = SubElement(root, 'EncAccounts')
    EncAccounts.text = encAccounts
    EncKey = SubElement(root, 'EncKey')
    EncKey.text = encKey
    Description = SubElement(root, 'Description')
    Description.text = "Guilgeenii utga"
    ApproveURL = SubElement(root, 'ApproveURL')
    ApproveURL.text = "localhost:8000/api"
    DeclineURL = SubElement(root, 'DeclineURL')
    DeclineURL.text = "localhost:8000/api"
    CancelURL = SubElement(root, 'CancelURL')
    CancelURL.text = "localhost:8000/api"
    return root


def bytesToHex(array):
    return str(binascii.hexlify(array))


def encrypts(data):
    dataString = tostring(data, encoding='utf-8')
    key = b'0123456789abcdef'
    datas = bytearray(dataString)
    cipher = DES3.new(key, DES3.MODE_CFB)
    msg = cipher.encrypt(datas)
    return msg


def signKey(data):
    pemLink = '/home/pc1/Desktop/bankApiTest/key.pem'
    f = open(pemLink, 'rb')
    key = RSA.importKey(f.read())
    cipher = PKCS1_v1_5.new(key)
    encrypted_message = cipher.encrypt(data.encode())
    return encrypted_message
